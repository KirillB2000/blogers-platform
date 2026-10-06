import { ObjectId } from "mongodb"
import { PostQueryInput } from "../api/input/post-query.input"
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model"
import { PostViewModel } from "../api/output/postViewModel"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { injectable } from "inversify"
import { PostsModel } from "./posts.model"
import { LikeStatus } from "../../../core/types/likeStatus"
import { PostLikesStatusModel, PostLikesStatusType } from "./postsLikesStatus.model"
import { LikeDetailsViewModel } from "../api/output/postLikeDetailsViewModel"
import { PagindatedOutput } from "../../../core/types/paginated.output"
import { PostListPaginatorOutput } from "../api/output/post-list-paginator.output"
import { mapToPostListPaginatedOutput } from "../mappers/map-from-post-domain-to-post-paginated-output"

@injectable()
export class PostsQwRepository {
    async findAll(
        queryDto: PostQueryInput,
        userId?: string | null,
        blogId?: string,
    ): Promise<PostListPaginatorOutput> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto

        const skip = (pageNumber - 1) * pageSize
        const filter: any = {}

        if (blogId) {
            filter.blogId = blogId
        }
        const items = await PostsModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)

        const totalCount = await PostsModel.countDocuments(filter)

        const pagesCount = Math.ceil(totalCount / pageSize)

        const meta: PagindatedOutput = {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount
        }

        
        const postIds = items.map(post => post._id.toString())
        const postLikesMap: Record<string, LikeStatus> = {}

        if (userId) {
            const postLikesStatusesDocuments = await PostLikesStatusModel
            .find({userId: userId, postId: { $in: postIds } })
            .lean()

            postLikesStatusesDocuments.forEach( doc => {
                postLikesMap[doc.postId] = doc.myStatus
            })
        }

        const allLikesDb = await PostLikesStatusModel
            .find({ postId: { $in: postIds }, myStatus: LikeStatus.Like })
            .sort({ addedAt: -1 })
            .lean() as PostLikesStatusType[]

        const postsWithPagination: PostListPaginatorOutput = mapToPostListPaginatedOutput(items, meta, postLikesMap, allLikesDb)

        return postsWithPagination
    }

    async findById(
        postId: string,
        userId?: string | null
    ): Promise<PostViewModel> {
        const postDocument = await PostsModel.findOne({ _id: new ObjectId(postId) })

        if (!postDocument) {
            throw new NotFoundError('Post not found')
        }

        let likeStatus = LikeStatus.None
        if (userId) {
            const postLikeStatusDb = await PostLikesStatusModel.findOne(
                {userId: userId, postId: postId}
            ).lean()

            if (postLikeStatusDb) likeStatus = postLikeStatusDb.myStatus
        }

        const likeDetailsDb = await PostLikesStatusModel
            .find( { postId, myStatus: LikeStatus.Like } )
            .sort( { addedAt: -1 } )
            .limit(3)
            .lean()

        const newestLikes: LikeDetailsViewModel[] = likeDetailsDb.map(likeD => {
            return {
                addedAt: likeD.addedAt,
                userId: likeD.userId,
                login: likeD.login
            }
        })

        const postForResponse = mapToPostViewModel(postDocument, likeStatus, newestLikes)

        return postForResponse
    }
}