import { WithId } from "mongodb";
import { PostInputModel } from "../api/input/dto/postInputModel";
import { mapPostInputDtoToDbType } from "../mappers/map-from-post-input-dto-to-db-type";
import { NotFoundError, BadRequestError, UnauthorizedError } from "../../../core/exceptions/app-errors.exeption";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { injectable, inject } from "inversify";
import { BlogsDocument } from "../../blogs/infrastructure/blogs.model";
import { PostsModel, PostsType } from "../infrastructure/posts.model";
import { LikeStatus } from "../../../core/types/likeStatus";
import { UsersRepository } from "../../users/infrastructure/user.repository";
import { PostsLikesStatusRepository } from "../infrastructure/postsLikesStatus.repository";
import { PostLikesStatusModel } from "../infrastructure/postsLikesStatus.model";
import { LIKES_MATCH } from "../../comments/constants/likesMatch";

@injectable()
export class PostsService {

    constructor(
        @inject(PostsRepository) private postsRepository: PostsRepository,
        @inject(BlogsRepository) private blogsRepository: BlogsRepository,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(PostsLikesStatusRepository) private postsLikesStatusRepository: PostsLikesStatusRepository 
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
            createdAt: new Date(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
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

    async updateLikeStatus (
        likeStatus: LikeStatus,
        postId: string,
        userId: string | null
    ): Promise<void> {

        let likesNumber = 0
        let dislikesNubmer = 0

        if (!userId) {
            throw new UnauthorizedError('Unauthorized')
        }

        const post = await this.postsRepository.findPostById(postId)

        if (!post) {
            throw new NotFoundError('Post not found')
        }

        let postLikeStatusDoc = await this.postsLikesStatusRepository.findLikeStatusForSpecificPost(postId, userId)

        if (!postLikeStatusDoc) {
            const userSendedLikeStatus = await this.usersRepository.findById(userId)

            if (!userSendedLikeStatus) {
                throw new UnauthorizedError('Unauthorized')
            }
            
            if (likeStatus === LikeStatus.None) {
                return
            }

            const login = userSendedLikeStatus.login
            const addedAt = new Date()
            postLikeStatusDoc = new PostLikesStatusModel({userId, postId, login, myStatus: likeStatus, addedAt})

            await this.postsLikesStatusRepository.save(postLikeStatusDoc)

            likeStatus === LikeStatus.Like ? likesNumber = 1 : dislikesNubmer = 1
            post.extendedLikesInfo.likesCount += likesNumber
            post.extendedLikesInfo.dislikesCount += dislikesNubmer

            return await this.postsRepository.save(post)
        }

        const likeChangingString = (postLikeStatusDoc.myStatus + likeStatus).toLocaleLowerCase()

        if (likeChangingString === LIKES_MATCH.LIKE_TO_LIKE || likeChangingString === LIKES_MATCH.DISLIKE_TO_DISLIKE) {
            return
        }

        if (likeChangingString === LIKES_MATCH.LIKE_TO_DISLIKE) {
            likesNumber = -1; dislikesNubmer = 1
        }

        if (likeChangingString === LIKES_MATCH.DISLIKE_TO_LIKE) {
            likesNumber = 1; dislikesNubmer = -1
        }

        if (likeChangingString === LIKES_MATCH.LIKE_TO_NONE) {
            likesNumber = -1; dislikesNubmer = 0

            post.extendedLikesInfo.likesCount += likesNumber
            post.extendedLikesInfo.dislikesCount += dislikesNubmer

            await Promise.all(
                [
                    this.postsRepository.save(post),
                    this.postsLikesStatusRepository.deleteLikeStatus(userId, postId)
                ]
            )
            return;
        }

        if (likeChangingString === LIKES_MATCH.DISLIKE_TO_NONE) {
            likesNumber = 0; dislikesNubmer = -1

            post.extendedLikesInfo.likesCount += likesNumber
            post.extendedLikesInfo.dislikesCount += dislikesNubmer

            await Promise.all(
                [
                    this.postsRepository.save(post),
                    this.postsLikesStatusRepository.deleteLikeStatus(userId, postId)
                ]
            )
            return;
        }

        postLikeStatusDoc.myStatus = likeStatus
        if (likeStatus === LikeStatus.Like) {
            postLikeStatusDoc.addedAt = new Date()
        }
        post.extendedLikesInfo.likesCount += likesNumber
        post.extendedLikesInfo.dislikesCount += dislikesNubmer

        await Promise.all(
            [
                this.postsRepository.save(post),
                this.postsLikesStatusRepository.save(postLikeStatusDoc)
            ]
        )

    }
} 