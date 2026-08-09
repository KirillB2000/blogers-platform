import { WithId } from "mongodb";
import { PComment } from "../input/comment";
import { CommentViewModel } from "../output/commentViewModel";

export const mapFromCommentDbTypeToViewModel = (
    dbComment: WithId<PComment>
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