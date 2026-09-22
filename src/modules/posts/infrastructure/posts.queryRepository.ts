import { ObjectId, WithId } from "mongodb"
import { PostQueryInput } from "../api/input/post-query.input"
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model"
import { PostViewModel } from "../api/output/post-data.output"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { injectable } from "inversify"
import { PostsDocument, PostsModel } from "./posts.model"

@injectable()
export class PostsQwRepository {
    async findAll(
        queryDto: PostQueryInput,
        blogId?: string
    ): Promise<{ items: PostsDocument[], totalCount: number }> {
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

        return { items, totalCount }
    }

    async findById(id: string): Promise<PostViewModel> {
        const post = await PostsModel.findOne({ _id: new ObjectId(id) })

        if (!post) {
            throw new NotFoundError('Post not found')
        }

        const postForResponse = mapToPostViewModel(post)

        return postForResponse
    }
}