import { CommentDb } from "../domain/comment";
import { CommentInputModel } from "../api/input/dto/commentInputModel";
import { commentsRepository } from "../infrastructure/comments.repository";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../../users/api/output/userViewModel";

export const commentsService = {
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

        const commentId = await commentsRepository.create(commentDomain)

        return commentId
    },

    async delete(
        commentId: string
    ): Promise<void> {
        const isDeleted = await commentsRepository.delete(commentId)

        if (!isDeleted) {
            throw new NotFoundError('Comment not found')
        }
    },

    async update(
        commentId: string,
        content: CommentInputModel
    ): Promise<void> {
        const isUpdated = await commentsRepository.update(commentId, content)

        if (!isUpdated) {
            throw new NotFoundError('Comment not found')
        }
    }
}