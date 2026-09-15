import { CommentDb } from "../domain/comment";
import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../../users/api/output/userViewModel";
import { CommentsRepository } from "../infrastructure/comments.repository";

export class CommentsService {
    constructor(
        private commentsRepository: CommentsRepository
    ){}


    async create(
        user: UserViewModel,
        postId: string,
        commentDto: CommentInputModel
    ): Promise<string> {
        const commentDomain: CommentDb = {
            postId: postId,
            content: commentDto.content,
            createdAt: new Date(),
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
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
}