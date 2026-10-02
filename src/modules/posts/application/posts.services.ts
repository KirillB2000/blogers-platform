import { WithId } from "mongodb";
import { PostInputModel } from "../api/input/dto/postInputModel";
import { mapPostInputDtoToDbType } from "../mappers/map-from-post-input-dto-to-db-type";
import { NotFoundError, BadRequestError } from "../../../core/exceptions/app-errors.exeption";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { injectable, inject } from "inversify";
import { BlogsDocument } from "../../blogs/infrastructure/blogs.model";
import { PostsModel, PostsType } from "../infrastructure/posts.model";

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

        const post = new PostsModel(newPost)

        await this.postsRepository.save(post)

        return post.id
    }

    async update(id: string, dto: PostInputModel): Promise<void> {
        const blog = await this.blogsRepository.findById(dto.blogId)
        
        if(!blog) {
            throw new BadRequestError([{message: 'Blog should exist', field: 'blogId'}])
        }

        const postDoc = await this.postsRepository.findPostById(id)

        if (!postDoc) {
            throw new NotFoundError('Post not found')
        }

        postDoc.set(dto)

        await this.postsRepository.save(postDoc)
    }

    async delete(id: string): Promise<void> {
        const isDeleted = await this.postsRepository.delete(id);
        
        if (!isDeleted) {
            throw new NotFoundError('Post not found')
        }
    }
} 