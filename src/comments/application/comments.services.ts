import { NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../../users/output/userViewModel";
import { PComment } from "../input/comment";
import { CommentInputModel } from "../input/dto/commentInputModel";
import { commentsRepository } from "../repository/comments.repository";

export const commentsService = {
    async create(
        user: UserViewModel,
        postId: string,
        commentDto: CommentInputModel
    ): Promise<string> {
        const commentDomain: PComment = {
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