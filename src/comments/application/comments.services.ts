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
    }
}