import { Blog } from "../domain/blog"
import { blogsRepository } from "../infrastructure/blogs.repository"
import { blogInputModel } from "../api/input/dto/blogInputModel"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { mapBlogInputDtoToDbType } from "../mappers/map-from-blog-input-dto-to-db-type"

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
