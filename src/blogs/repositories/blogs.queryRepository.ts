import { blogsCollection } from "../../db/collections"
import { BlogQueryInput } from "../routes/input/blog-query.input"
import { Blog } from "../domain/blog"
import { ObjectId, WithId } from "mongodb"
import { BlogViewModel } from "../routes/output/blog-data.output"
import { NotFoundError } from "../../core/exceptions/app-errors.exeption"
import { mapToBlogViewModel } from "../routes/mappers/map-from-blog-db-type-to-view-model"

export const blogsQwRepository = {
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[], totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm
        } = queryDto

        const skip = (pageNumber - 1) * pageSize
        const filter: any = {}

        if (searchNameTerm) {
            filter.name = { $regex: searchNameTerm, $options: 'i' }
        }

        const items = await blogsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await blogsCollection.countDocuments(filter)

        return { items, totalCount }
    },

    async findById(id: ObjectId | string): Promise<BlogViewModel> {
        const blogFromDb: WithId<Blog> | null = await blogsCollection.findOne({_id: new ObjectId(id)})

        if (!blogFromDb) {
            throw new NotFoundError('Blog not found')
        }

        const blogForResponse: BlogViewModel = mapToBlogViewModel(blogFromDb) // Нарушение паттерна CQS 😒

        return blogForResponse
    },
}