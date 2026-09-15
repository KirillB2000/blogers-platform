import { Request, Response } from "express"
import { CommentInputModel } from "../../comments/api/input/dto/commentInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { UsersQwRepository } from "../../users/infrastructure/user.queryRepository";
import { PostsQwRepository } from "../infrastructure/posts.queryRepository";
import { CommentsQwRepository } from "../../comments/infrastructure/comments.queryRepository";
import { CommentsService } from "../../comments/application/comments.services";
import { BadRequestError } from "../../../core/exceptions/app-errors.exeption";
import { ObjectId, WithId } from "mongodb";
import { BlogViewModel } from "../../blogs/api/output/blog-data.output";
import { PostInputModel } from "./input/dto/postInputModel";
import { PostViewModel } from "./output/post-data.output";
import { PostsService } from "../application/posts.services";
import { BlogsQwRepository } from "../../blogs/infrastructure/blogs.queryRepository";
import { CommentQueryInput } from "../../comments/api/input/commentQueryInput";
import { CommentListPaginatorOutput } from "../../comments/api/output/commentListPaginatorOutput";
import { PostQueryInput } from "./input/post-query.input";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { Post } from "../domain/post";
import { mapToPostListPaginatedOutput } from "../mappers/map-from-post-domain-to-post-paginated-output";
import { PostListPaginatorOutput } from "./output/post-list-paginator.output";

export class PostsController {
    constructor (
        private postsService: PostsService,
        private commentsService: CommentsService,
        private commentsQwRepository: CommentsQwRepository,
        private usersQwRepository: UsersQwRepository,
        private postsQwRepository: PostsQwRepository,
        private blogsQwRepository: BlogsQwRepository
    ) {}

    async createCommentForSpecificPostHandler (
        req: Request<{ postId: string }, {}, CommentInputModel>,
        res: Response
    ) {
        const userId = req.user?.id as string
        const { postId } = req.params
        const commentInput = req.body

        if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

        const userById = await this.usersQwRepository.findById(userId)
        if (!userById) return res.sendStatus(httpStatuses.Unauthorized)

        const postById = await this.postsQwRepository.findById(postId)
        if (!postById) return res.sendStatus(httpStatuses.NotFound)

        const commentId = await this.commentsService.create(userById, postId, commentInput)

        const comment = await this.commentsQwRepository.findById(commentId)

        res.status(httpStatuses.Created).json(comment)
    }

    async createPostHandler (
        req: Request<{}, {}, PostInputModel>,
        res: Response,
    ) {
        const blogById: BlogViewModel = await this.blogsQwRepository.findById(req.body.blogId);

        if (!blogById) {
            throw new BadRequestError([{ message: 'Blog should exist', field: 'blogId' }])
        }

        const createdPostId: ObjectId = await this.postsService.create(req.body);

        const createdPostForResponse: PostViewModel = await this.postsQwRepository.findById(createdPostId)

        res.status(httpStatuses.Created).json(createdPostForResponse);
    }

    async deletePostByIdHandler (
        req: Request<{ id: string }>, 
        res: Response
    ) {
        await this.postsService.delete(req.params.id)

        res.sendStatus(httpStatuses.NoContent);
    }

    async getCommentListForSpecificPostHandler (
        req: Request<{ postId: string }, {}, {}, CommentQueryInput>,
        res: Response
    ) {
        const { postId } = req.params
        const queryInput = req.query

        await this.postsQwRepository.findById(postId) // throw 404 внутри repo

        const comments: CommentListPaginatorOutput = await this.commentsQwRepository.findAll(queryInput, postId)

        res.status(httpStatuses.Ok).json(comments)
    }

    async getPostByIdHandler (
        req: Request<{ id: string }>,
        res: Response
    ) {
        const postId = req.params.id

        const postById: PostViewModel = await this.postsQwRepository.findById(postId);

        res.status(httpStatuses.Ok).json(postById);
    }

    async getPostListHandler (
        req: Request<{}, {}, {}, PostQueryInput>,
        res: Response
    ) {
        const queryInput = req.query
        const posts: { items: WithId<Post>[], totalCount: number } = await this.postsQwRepository.findAll(queryInput)

        const pagesCount = Math.ceil(posts.totalCount / queryInput.pageSize)
        const meta: PagindatedOutput = {
            pagesCount: pagesCount,
            page: queryInput.pageNumber,
            pageSize: queryInput.pageSize,
            totalCount: posts.totalCount,
        }

        const postsWithPagination: PostListPaginatorOutput = mapToPostListPaginatedOutput(posts.items, meta)

        res.status(httpStatuses.Ok).json(postsWithPagination)
    }

    async updatePostByIdHandler (
        req: Request<{ id: string }, {}, PostInputModel>,
        res: Response,
    ) {
        await this.postsService.update(req.params.id, req.body);

        res.sendStatus(httpStatuses.NoContent);
    }
}