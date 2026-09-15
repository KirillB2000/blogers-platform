import { ObjectId, WithId } from "mongodb";
import { Post } from "../domain/post";
import { PostInputModel } from "../api/input/dto/postInputModel";
import { mapPostInputDtoToDbType } from "../mappers/map-from-post-input-dto-to-db-type";
import { Blog } from "../../blogs/domain/blog";
import { NotFoundError, BadRequestError } from "../../../core/exceptions/app-errors.exeption";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";

export class PostsService {

    constructor(
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository
    ) {}

    async create(dto: PostInputModel): Promise<ObjectId> {

        const blog: WithId<Blog> | null = await this.blogsRepository.findById(dto.blogId)

        if (!blog) {
            throw new NotFoundError('Blog is not found')
        }

        const newPost: Post = {
            ...mapPostInputDtoToDbType(dto),
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date()
        }

        const createdPostId: ObjectId = await this.postsRepository.create(newPost)

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