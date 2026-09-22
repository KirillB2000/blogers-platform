import { WithId } from "mongodb";
import { PostInputModel } from "../api/input/dto/postInputModel";
import { mapPostInputDtoToDbType } from "../mappers/map-from-post-input-dto-to-db-type";
import { NotFoundError, BadRequestError } from "../../../core/exceptions/app-errors.exeption";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { injectable, inject } from "inversify";
import { BlogsDocument } from "../../blogs/infrastructure/blogs.model";
import { PostsType } from "../infrastructure/posts.model";

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository
    ) {}

    async create(dto: PostInputModel): Promise<string> {

        const blog: WithId<BlogsDocument> | null = await this.blogsRepository.findById(dto.blogId)

        if (!blog) {
            throw new NotFoundError('Blog is not found')
        }

        const newPost: PostsType = {
            ...mapPostInputDtoToDbType(dto),
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date()
        }

        const createdPostId = await this.postsRepository.create(newPost)

        return createdPostId
    }

    async update(id: string, dto: PostInputModel): Promise<void> {
        const blog = await this.blogsRepository.findById(dto.blogId)
        
        if(!blog) {
            throw new BadRequestError([{message: 'Blog should exist', field: 'blogId'}])
        }

        const isUpdated = await this.postsRepository.update(id, dto)

        if (!isUpdated) {
            throw new NotFoundError('Post not found')
        }
    }

    async delete(id: string): Promise<void> {
        const isDeleted = await this.postsRepository.delete(id);
        
        if (!isDeleted) {
            throw new NotFoundError('Post not found')
        }
    }
} 