import { WithId } from "mongodb"
import { Blog } from "../domain/blog"
import { blogsRepository } from "../repositories/blogs.repository"
import { blogInputModel } from "../dto/blogInputModel"
import { mapBlogInputDtoToDbType } from "../routes/mappers/map-from-blog-input-dto-to-db-type"
import { BlogQueryInput } from "../routes/input/blog-query.input"

export const blogsService = {
    async findMany(
        queryDto: BlogQueryInput
    ): Promise<{ items: WithId<Blog>[], totalCount: number }> {
        return blogsRepository.findMany(queryDto)
    },

    async findById(id: string): Promise<WithId<Blog> | null> {
        return blogsRepository.findById(id)
    },

    async create(dto: blogInputModel): Promise<WithId<Blog>> {
        const newBlog: Blog = {
            ...mapBlogInputDtoToDbType(dto),
            createdAt: new Date(),
            isMembership: false
        }

        const createdBlog: WithId<Blog> = await blogsRepository.create(newBlog)

        return createdBlog
    },

    async update(id: string,  dto: blogInputModel): Promise<boolean> {
        return await blogsRepository.update(id, dto)
    },

    async delete(id: string): Promise<boolean> {
        return await blogsRepository.delete(id)
    }
}