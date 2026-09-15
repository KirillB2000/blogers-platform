import { Blog } from "../domain/blog"
import { blogInputModel } from "../api/input/dto/blogInputModel"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { mapBlogInputDtoToDbType } from "../mappers/map-from-blog-input-dto-to-db-type"
import { BlogsRepository } from "../infrastructure/blogs.repository"

export class BlogsService {
    constructor (
        private blogsRepository: BlogsRepository
    ) {}

    async create(dto: blogInputModel): Promise<string> {
        const newBlog: Blog = {
            ...mapBlogInputDtoToDbType(dto),
            createdAt: new Date(),
            isMembership: false
        }

        const blogsId = await this.blogsRepository.create(newBlog)

        return blogsId
    }

    async update(id: string,  dto: blogInputModel): Promise<void> {
        const isUpdated = await this.blogsRepository.update(id, dto)

        if (!isUpdated) {
            throw new NotFoundError('Blog not found')
        }
    }

    async delete(id: string): Promise<void> {
        const isDeleted = await this.blogsRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('Blog not found')
        }
    }
}
