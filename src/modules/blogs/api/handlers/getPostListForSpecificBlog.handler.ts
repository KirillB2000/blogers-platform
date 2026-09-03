import { Request, Response } from "express"
import { PostQueryInput } from "../../../posts/api/input/post-query.input"
import { Post } from "../../../posts/domain/post"
import { WithId } from "mongodb"
import { PostListPaginatorOutput } from "../../../posts/api/output/post-list-paginator.output"
import { mapToPostListPaginatedOutput } from "../../../posts/mappers/map-from-post-domain-to-post-paginated-output"
import { BlogViewModel } from "../output/blog-data.output"
import { blogsQwRepository } from "../../infrastructure/blogs.queryRepository"
import { postsQwRepository } from "../../../posts/infrastructure/posts.queryRepository"
import { NotFoundError } from "../../../../core/exceptions/app-errors.exeption"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { PagindatedOutput } from "../../../../core/types/paginated.output"

export const getPostListForSpecificBlog = async (
    req: Request<{blogId: string}, {}, {}, PostQueryInput>,
    res: Response
) => {
    const queryInput: PostQueryInput = req.query
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