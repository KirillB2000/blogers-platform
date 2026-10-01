import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { CommentQueryInput } from "../api/input/commentQueryInput";
import { CommentListPaginatorOutput } from "../api/output/commentListPaginatorOutput";
import { CommentViewModel } from "../api/output/commentViewModel";
import { mapFromCommentDbTypeToViewModel } from "../mappers/mapFromCommentDbTypeToViewModel";
import { mapToCommentListPaginatedOutput } from "../mappers/mapFromCommentDomainToPaginatedOutput";
import { injectable } from "inversify";
import { CommentsModel } from "./comments.model";
import { LikesStatusModel, LikeStatus } from "./likesStatus.model";

@injectable()
export class CommentsQwRepository {
    async findById (
        commentId: string,
        userId?: string | null
    ): Promise<CommentViewModel> {
        let likeStatus = LikeStatus.None
        if(userId) {
            const likeStatusDb = await LikesStatusModel.findOne(
                { userId: userId, commentId: commentId }
            )

            if (likeStatusDb) likeStatus = likeStatusDb.myStatus
        }

        let commentDocument = await CommentsModel.findOne({ _id: commentId })

        if (!commentDocument) {
            throw new NotFoundError('Comment not found')
        }

        const commentForResponse: CommentViewModel = mapFromCommentDbTypeToViewModel(commentDocument, likeStatus)

        return commentForResponse
    }

    async findAll (
        queryDto: CommentQueryInput,
        postId: string,
        userId?: string | null
    ): Promise<CommentListPaginatorOutput> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = queryDto

        const skip = (pageNumber - 1) * pageSize
        const filter = {postId: postId}

        const items = await CommentsModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
        
        const totalCount = await CommentsModel.countDocuments(filter)

        const meta: PagindatedOutput = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount
        }

        let likesMap: Record<string, LikeStatus> = {}

        if (userId) {
            const likeStatusesDocuments = await LikesStatusModel
                .find({ commentId: { $in: items.map(comm => comm._id.toString()) }, userId: userId })

            likeStatusesDocuments.forEach(doc => {
                likesMap[doc.commentId] = doc.myStatus
            })
        }

        const commentsWithPagination: CommentListPaginatorOutput = mapToCommentListPaginatedOutput(items, meta, likesMap) // Антипаттерн 😒

        return commentsWithPagination
    }
}