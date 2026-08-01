import { Request, Response } from "express"
import { PostQueryInput } from "../../../posts/routes/input/post-query.input"
import { postsServices } from "../../../posts/application/posts.services"
import { Post } from "../../../posts/domain/post"
import { WithId } from "mongodb"
import { PagindatedOutput } from "../../../core/types/paginated.output"
import { PostListPaginatorOutput } from "../../../posts/routes/output/post-list-paginator.output"
import { mapToPostListPaginatedOutput } from "../../../posts/routes/mappers/map-from-post-domain-to-post-paginated-output"
import { httpStatuses } from "../../../core/types/http-statuses"
import { blogsRepository } from "../../repositories/blogs.repository"
import { Blog } from "../../domain/blog"
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption"
import { blogInputModel } from "../../dto/blogInputModel"
import { BlogViewModel } from "../output/blog-data.output"
import { blogsQwRepository } from "../../repositories/blogs.queryRepository"
import { postsQwRepository } from "../../../posts/repositories/posts.queryRepository"

export const getPostListForSpecificBlog = async (
    req: Request<{blogId: string}, {}, {}, PostQueryInput>,
    res: Response
) => {
    const queryInput = req.query
    const blogId = req.params.blogId

    const blog: BlogViewModel = await blogsQwRepository.findById(blogId)

    if (!blog) {
        throw new NotFoundError('Blog not found')
    }

    const posts: {items: WithId<Post>[], totalCount: number} = await postsQwRepository.findAll(queryInput, blogId)

    const pagesCount = Math.ceil(posts.totalCount / queryInput.pageSize)
    
    const meta : PagindatedOutput = {
        pagesCount: pagesCount,
        page: queryInput.pageNumber,
        pageSize: queryInput.pageSize,
        totalCount: posts.totalCount
    }
    const postsWithPagination: PostListPaginatorOutput = mapToPostListPaginatedOutput(posts.items, meta)

    res.status(httpStatuses.Ok).json(postsWithPagination)
}