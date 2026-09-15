import { Request, Response } from "express";
import { blogInputModel } from "./input/dto/blogInputModel";
import { BlogViewModel } from "./output/blog-data.output";
import { httpStatuses } from "../../../core/types/http-statuses";
import { BlogsService } from "../application/blogs.services";
import { BlogsQwRepository } from "../infrastructure/blogs.queryRepository";
import { PostBlogInputModel } from "../../posts/api/input/dto/postBlogInputModel";
import { PostInputModel } from "../../posts/api/input/dto/postInputModel";
import { ObjectId, WithId } from "mongodb";
import { PostViewModel } from "../../posts/api/output/post-data.output";
import { PostsService } from "../../posts/application/posts.services";
import { PostsQwRepository } from "../../posts/infrastructure/posts.queryRepository";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { BlogListPaginatedOutput } from "./output/blog-list-paginator.output";
import { mapToBlogListPaginatedOutput } from "../mappers/map-from-blog-domain-to-blog-list-paginated-output";
import { BlogQueryInput } from "./input/blog-query.input";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { PostQueryInput } from "../../posts/api/input/post-query.input";
import { PostListPaginatorOutput } from "../../posts/api/output/post-list-paginator.output";
import { Post } from "../../posts/domain/post";
import { mapToPostListPaginatedOutput } from "../../posts/mappers/map-from-post-domain-to-post-paginated-output";

export class BlogsController {
    constructor (
        private blogsService: BlogsService,
        private postsService: PostsService,
        private postsQwRepository: PostsQwRepository,
        private blogsQwRepository: BlogsQwRepository
    ) {}

    async createBlogHandler (
        req: Request<{}, {}, blogInputModel>,
        res: Response,
    ) {
        const blogsId = await this.blogsService.create(req.body);
        const createdObject: BlogViewModel = await this.blogsQwRepository.findById(blogsId)

        res.status(httpStatuses.Created).json(createdObject);
    }

    async createPostForSpecificBlogHandler (
        req: Request<{ blogId: string }, {}, PostBlogInputModel>,
        res: Response
    ) {
        const blogId = req.params.blogId
        const postInputDto: PostInputModel = { blogId, ...req.body }    

        const createdPostId: ObjectId = await this.postsService.create(postInputDto)
        const createdPost: PostViewModel = await this.postsQwRepository.findById(createdPostId) 
        
        res.status(httpStatuses.Created).json(createdPost)
    }

    async deleteBlogByIdHandler (
        req: Request<{ id: string }>, 
        res: Response
    ) {
        await this.blogsService.delete(req.params.id);

        res.sendStatus(httpStatuses.NoContent);
    }

    async getBlogByIdHandler (
        req: Request<{ id: string }>,
        res: Response,
    ) {
        const blogId = req.params.id;

        const blogById: BlogViewModel = await this.blogsQwRepository.findById(blogId);

        res.status(httpStatuses.Ok).json(blogById);
    }

    async getBlogListHandler (
        req: Request<{}, {}, {}, BlogQueryInput>,
        res: Response
    ) {
        const queryInput = req.query
        const { items, totalCount } = await this.blogsQwRepository.findMany(queryInput)

        const pagesCount = Math.ceil(totalCount / queryInput.pageSize)
        const meta: PagindatedOutput = {
            pagesCount: pagesCount,
            page: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: totalCount
        }

        const blogListOutput: BlogListPaginatedOutput = mapToBlogListPaginatedOutput(items, meta)

        res.status(httpStatuses.Ok).send(blogListOutput)
    }

    async getPostListForSpecificBlog (
        req: Request<{ blogId: string }, {}, {}, PostQueryInput>,
        res: Response
    ) {
        const queryInput: PostQueryInput = req.query
        const blogId = req.params.blogId

        const blog: BlogViewModel = await this.blogsQwRepository.findById(blogId)

        if (!blog) {
            throw new NotFoundError('Blog not found')
        }

        const posts: { items: WithId<Post>[], totalCount: number } = await this.postsQwRepository.findAll(queryInput, blogId)

        const pagesCount = Math.ceil(posts.totalCount / queryInput.pageSize)

        const meta: PagindatedOutput = {
            pagesCount: pagesCount,
            page: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: posts.totalCount
        }
        const postsWithPagination: PostListPaginatorOutput = mapToPostListPaginatedOutput(posts.items, meta)

        res.status(httpStatuses.Ok).json(postsWithPagination)
    }

    async updateBlogByIdHandler (
        req: Request<{ id: string }, {}, blogInputModel>,
        res: Response,
    ) {
        await this.blogsService.update(req.params.id, req.body);

        res.sendStatus(httpStatuses.NoContent);
    }
}