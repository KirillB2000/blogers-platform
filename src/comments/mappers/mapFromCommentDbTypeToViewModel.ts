import { WithId } from "mongodb";
import { CommentDb } from "../input/comment";
import { CommentViewModel } from "../output/commentViewModel";

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