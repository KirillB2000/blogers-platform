import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../../users/api/output/userViewModel";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { injectable, inject } from "inversify";
import { CommentsType } from "../infrastructure/comments.model";
import { LikeStatus } from "../infrastructure/likesStatus.model";
import { PostsRepository } from "../../posts/infrastructure/posts.repository";
import { UsersRepository } from "../../users/infrastructure/user.repository";
import { LikesStatusCommentsRepository } from "../infrastructure/likesStatusComments.repository";

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepository) private commentsRepository: CommentsRepository,
        @inject(UsersRepository) private userRepository: UsersRepository,
        @inject(LikesStatusCommentsRepository) private likesStatusCommentsRepository: LikesStatusCommentsRepository
    ){}


    async create(
        user: UserViewModel,
        postId: string,
        commentDto: CommentInputModel
    ): Promise<string> {
        const commentDomain: CommentsType = {
            postId: postId,
            content: commentDto.content,
            createdAt: new Date(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            likesInfo : {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        }

        const commentId = await this.commentsRepository.create(commentDomain)

        return commentId
    }

    async delete(
        commentId: string
    ): Promise<void> {
        const isDeleted = await this.commentsRepository.delete(commentId)

        if (!isDeleted) {
            throw new NotFoundError('Comment not found')
        }
    }

    async update(
        commentId: string,
        content: CommentInputModel
    ): Promise<void> {
        const isUpdated = await this.commentsRepository.update(commentId, content)

        if (!isUpdated) {
            throw new NotFoundError('Comment not found')
        }
    }

    async updateLikeStatus(
        userId: string,
        commentId: string,
        likeStatus: LikeStatus
    ): Promise<void> {
        let likesNumber = 0
        let dislikesNubmer = 0

        const comment = await this.commentsRepository.findById(commentId)

        if (!comment) {
            throw new NotFoundError('Comment not found')
        }

        const userWithLikeStatus = await this.userRepository.findById(userId)

        if (!userWithLikeStatus) {
            throw new BadRequestError([{message: 'User must exist', field: 'userId'}])
        }

        const likeStatusDb = await this.likesStatusCommentsRepository.findLikeStatusForSpecificComment(userId, commentId)

        if (!likeStatusDb) {
            await this.likesStatusCommentsRepository.saveLikeStatus(userId, commentId, likeStatus)
            likeStatus === LikeStatus.Like ? likesNumber = 1 : dislikesNubmer = 1

            return await this.commentsRepository.updateLikesAndDislikes(likesNumber, dislikesNubmer, commentId)
        }

        const likeChangingString = (likeStatus + likeStatusDb.myStatus).toLocaleLowerCase()

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
            await Promise.all(
                [
                    this.commentsRepository.updateLikesAndDislikes(likesNumber, dislikesNubmer, commentId),
                    this.likesStatusCommentsRepository.deleteLikeStatus(userId, commentId)
                ]
            )
            return;
        }

        if (likeChangingString === LIKES_MATCH.DISLIKE_TO_NONE) {
            likesNumber = 0; dislikesNubmer = -1
            await Promise.all(
                [
                    this.commentsRepository.updateLikesAndDislikes(likesNumber, dislikesNubmer, commentId),
                    this.likesStatusCommentsRepository.deleteLikeStatus(userId, commentId)
                ]
            )
            return;
        }
        
        await Promise.all(
            [
                this.commentsRepository.updateLikesAndDislikes(likesNumber, dislikesNubmer, commentId),
                this.likesStatusCommentsRepository.updateLikeStatus(userId, commentId, likeStatus)
            ]
        )
    }
}