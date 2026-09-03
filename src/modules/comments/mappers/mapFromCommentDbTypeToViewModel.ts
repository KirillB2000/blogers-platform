import { WithId } from "mongodb";
import { CommentDb } from "../domain/comment";
import { CommentViewModel } from "../api/output/commentViewModel";

export const mapFromCommentDbTypeToViewModel = (
    dbComment: WithId<CommentDb>
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