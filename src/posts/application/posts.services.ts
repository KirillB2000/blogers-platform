import { ObjectId, WithId } from "mongodb";
import { Post } from "../domain/post";
import { postsRepository } from "../repositories/posts.repository";
import { postInputModel } from "../dto/postInputModel";
import { mapPostInputDtoToDbType } from "../routes/mappers/map-from-post-input-dto-to-db-type";
import { BadRequestError, NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { blogsQwRepository } from "../../blogs/repositories/blogs.queryRepository";
import { Blog } from "../../blogs/domain/blog";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";

export const postsServices = {

    async create(dto: postInputModel): Promise<ObjectId> {

        const blog: WithId<Blog> | null = await blogsRepository.findById(dto.blogId)

        if (!blog) {
            throw new BadRequestError([{ message: 'Blog should exist', field: 'blogId' }])
        }

        const newPost: Post = {
            ...mapPostInputDtoToDbType(dto),
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date()
        }

        const createdPostId: ObjectId = await postsRepository.create(newPost)

        return createdPostId
    },

    async update(id: string, dto: postInputModel): Promise<void> {
        const blog = await blogsRepository.findById(dto.blogId)
        
        if(!blog) {
            throw new BadRequestError([{message: 'Blog should exist', field: 'blogId'}])
        }

        const isUpdated = await postsRepository.update(id, dto)

        if (!isUpdated) {
            throw new NotFoundError('Post not found')
        }
    },

    async delete(id: string): Promise<void> {
        const isDeleted = await postsRepository.delete(id);
        
        if (!isDeleted) {
            throw new NotFoundError('Post not found')
        }
    }
} 