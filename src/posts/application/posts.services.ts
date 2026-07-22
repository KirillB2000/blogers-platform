import { WithId } from "mongodb";
import { Post } from "../domain/post";
import { postsRepository } from "../repositories/posts.repository";
import { create } from "node:domain";
import { postInputModel } from "../dto/postInputModel";
import { mapPostInputDtoToDbType } from "../routes/mappers/map-from-post-input-dto-to-db-type";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";
import { blogsService } from "../../blogs/application/blogs.services";
import { PostQueryInput } from "../routes/input/post-query.input";

export const postsServices = {
    async findMany(
        queryDto: PostQueryInput
    ): Promise<{items: WithId<Post>[], totalCount: number}> {
        const posts = await postsRepository.findAll(queryDto)
        
        return posts
    },

    async findById(id: string): Promise<WithId<Post> | null> {
        const post = await postsRepository.findById(id)

        return post
    },

    async create(dto: postInputModel, blogId: string): Promise<WithId<Post> | null> {
        const blogById = await blogsRepository.findById(blogId);
        
        if (!blogById) {
            return null
        }

        const newPost: Post = {
            ...mapPostInputDtoToDbType(dto),
            blogId: blogById._id.toString(),
            blogName: blogById.name,
            createdAt: new Date()
        }

        const createdPost: WithId<Post> = await postsRepository.create(newPost)

        return createdPost
    },

    async update(id: string, dto: postInputModel): Promise<boolean | null> {
        const blog = await blogsService.findById(dto.blogId)
        
        if(!blog) {
            return null
        }
        return await postsRepository.update(id, dto)
    },

    async delete(id: string): Promise<boolean> {
        return await postsRepository.delete(id)
    }
} 