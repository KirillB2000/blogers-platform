import { ObjectId } from "mongodb"
import { Blog } from "../domain/blog"
import { blogsRepository } from "../repositories/blogs.repository"
import { blogInputModel } from "../dto/blogInputModel"
import { mapBlogInputDtoToDbType } from "../routes/mappers/map-from-blog-input-dto-to-db-type"
import { NotFoundError } from "../../core/exceptions/app-errors.exeption"

export const blogsService = {
    async create(dto: blogInputModel): Promise<string> {
        const newBlog: Blog = {
            ...mapBlogInputDtoToDbType(dto),
            createdAt: new Date(),
            isMembership: false
        }

        const blogsId = await blogsRepository.create(newBlog)

        return blogsId
    },

    async update(id: string,  dto: blogInputModel): Promise<void> {
        const isUpdated = await blogsRepository.update(id, dto)

        if (!isUpdated) {
            throw new NotFoundError('Blog not found')
        }
    },

    async delete(id: string): Promise<void> {
        const isDeleted = await blogsRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('Blog not found')
        }
    }
}
