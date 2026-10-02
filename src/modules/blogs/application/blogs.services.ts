import { blogInputModel } from "../api/input/dto/blogInputModel"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { mapBlogInputDtoToDbType } from "../mappers/map-from-blog-input-dto-to-db-type"
import { BlogsRepository } from "../infrastructure/blogs.repository"
import { injectable, inject } from "inversify"
import { BlogsModel, BlogsType } from "../infrastructure/blogs.model"

@injectable()
export class BlogsService {
    constructor (
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {}

    async create(dto: blogInputModel): Promise<string> {
        const newBlog: BlogsType = {
            ...mapBlogInputDtoToDbType(dto),
            createdAt: new Date(),
            isMembership: false
        }

        const blogDoc = new BlogsModel(newBlog)

        await this.blogsRepository.save(blogDoc)

        return blogDoc.id
    }

    async update(id: string,  dto: blogInputModel): Promise<void> {

        const blogDoc = await this.blogsRepository.findById(id)

        if (!blogDoc) {
            throw new NotFoundError('Blog not found')
        }

        blogDoc.set(dto)
        await this.blogsRepository.save(blogDoc)
    }

    async delete(id: string): Promise<void> {
        const isDeleted = await this.blogsRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('Blog not found')
        }
    }
}
