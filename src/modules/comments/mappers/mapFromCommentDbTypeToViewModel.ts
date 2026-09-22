import { CommentViewModel } from "../api/output/commentViewModel";
import { CommentsDocument } from "../infrastructure/comments.model";

export const mapFromCommentDbTypeToViewModel = (
    dbComment: CommentsDocument
): CommentViewModel => {
    return {
        id: dbComment._id.toString(),
        content: dbComment.content,
        commentatorInfo: {
            userId: dbComment.commentatorInfo.userId,
            userLogin: dbComment.commentatorInfo.userLogin
        },
        createdAt: dbComment.createdAt
    }
}