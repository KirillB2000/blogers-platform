import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { NotFoundError, UnauthorizedError } from "../../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../../users/api/output/userViewModel";
import { CommentsRepository } from "../infrastructure/comments.repository";
import { injectable, inject } from "inversify";
import { CommentsModel, CommentsType } from "../infrastructure/comments.model";
import { LikesStatusModel } from "../infrastructure/likesStatus.model";
import { UsersRepository } from "../../users/infrastructure/user.repository";
import { LikesStatusCommentsRepository } from "../infrastructure/likesStatusComments.repository";
import { LIKES_MATCH } from "../constants/likesMatch";
import { LikeStatus } from "../../../core/types/likeStatus";

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
                dislikesCount: 0
            }
        }

        const comment = new CommentsModel(commentDomain)
        
        await this.commentsRepository.save(comment)

        return comment.id
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
        userInput: CommentInputModel
    ): Promise<void> {
        const commentById = await this.commentsRepository.findById(commentId)

        if (!commentById) {
            throw new NotFoundError('Comment not found')
        }

        commentById.content = userInput.content

        await this.commentsRepository.save(commentById)
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
            throw new UnauthorizedError('Unauthorized')
        }

        let likeStatusDocument = await this.likesStatusCommentsRepository.findLikeStatusForSpecificComment(userId, commentId)

        if (!likeStatusDocument) {
            if (likeStatus === LikeStatus.None) return

            likeStatusDocument = new LikesStatusModel({ userId, commentId })

            likeStatusDocument.myStatus = likeStatus

            await this.likesStatusCommentsRepository.save(likeStatusDocument)

            likeStatus === LikeStatus.Like ? likesNumber = 1 : dislikesNubmer = 1
            comment.likesInfo.likesCount += likesNumber
            comment.likesInfo.dislikesCount += dislikesNubmer

            return await this.commentsRepository.save(comment)
        }

        const likeChangingString = (likeStatus + likeStatusDocument.myStatus).toLocaleLowerCase()

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

            comment.likesInfo.likesCount += likesNumber
            comment.likesInfo.dislikesCount += dislikesNubmer

            await Promise.all(
                [
                    this.commentsRepository.save(comment),
                    this.likesStatusCommentsRepository.deleteLikeStatus(userId, commentId)
                ]
            )
            return;
        }

        if (likeChangingString === LIKES_MATCH.DISLIKE_TO_NONE) {
            likesNumber = 0; dislikesNubmer = -1

            comment.likesInfo.likesCount += likesNumber
            comment.likesInfo.dislikesCount += dislikesNubmer
            
            await Promise.all(
                [
                    this.commentsRepository.save(comment),
                    this.likesStatusCommentsRepository.deleteLikeStatus(userId, commentId)
                ]
            )
            return;
        }

        likeStatusDocument.myStatus = likeStatus
        comment.likesInfo.likesCount += likesNumber
        comment.likesInfo.dislikesCount += dislikesNubmer
        
        await Promise.all(
            [
                this.commentsRepository.save(comment),
                this.likesStatusCommentsRepository.save(likeStatusDocument)
            ]
        )
    }
}