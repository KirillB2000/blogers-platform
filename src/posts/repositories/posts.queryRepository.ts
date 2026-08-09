import { ObjectId, WithId } from "mongodb"
import { PostQueryInput } from "../input/post-query.input"
import { Post } from "../input/post"
import { postsCollection } from "../../db/collections"
import { NotFoundError } from "../../core/exceptions/app-errors.exeption"
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model"
import { PostViewModel } from "../output/post-data.output"

export const postsQwRepository = {
    async findAll(
        queryDto: PostQueryInput,
        blogId?: string
    ): Promise<{ items: WithId<Post>[], totalCount: number }> {
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
        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await postsCollection.countDocuments(filter)

        return { items, totalCount }
    },

    async findById(id: string | ObjectId): Promise<PostViewModel> {
        const post = await postsCollection.findOne({ _id: new ObjectId(id) })

        if (!post) {
            throw new NotFoundError('Post not found')
        }

        const postForResponse = mapToPostViewModel(post)

        return postForResponse
    },
}