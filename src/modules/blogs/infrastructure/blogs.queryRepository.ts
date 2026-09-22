import { BlogQueryInput } from "../api/input/blog-query.input"
import { ObjectId } from "mongodb"
import { BlogViewModel } from "../api/output/blog-data.output"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model"
import { injectable } from "inversify"
import { BlogsDocument, BlogsModel } from "./blogs.model"

@injectable()
export class BlogsQwRepository { // Сделать маппинг здесь
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: BlogsDocument[], totalCount: number }> {
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

        const items = await BlogsModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)

        const totalCount = await BlogsModel.countDocuments(filter)

        return { items, totalCount }
    }

    async findById(id: ObjectId | string): Promise<BlogViewModel> {
        const blogFromDb: BlogsDocument | null = await BlogsModel.findOne({_id: new ObjectId(id)})

        if (!blogFromDb) {
            throw new NotFoundError('Blog not found')
        }

        const blogForResponse: BlogViewModel = mapToBlogViewModel(blogFromDb) // Нарушение паттерна CQS 😒

        return blogForResponse
    }
}