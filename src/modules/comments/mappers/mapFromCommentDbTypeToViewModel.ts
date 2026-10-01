import { CommentViewModel } from "../api/output/commentViewModel";
import { CommentsDocument } from "../infrastructure/comments.model";
import { LikeStatus } from "../infrastructure/likesStatus.model";

export const mapFromCommentDbTypeToViewModel = (
    dbComment: CommentsDocument,
    likeStatus: LikeStatus
): CommentViewModel => {
    return {
        id: dbComment._id.toString(),
        content: dbComment.content,
        commentatorInfo: {
            userId: dbComment.commentatorInfo.userId,
            userLogin: dbComment.commentatorInfo.userLogin
        },
        createdAt: dbComment.createdAt,
        likesInfo: {
            likesCount: dbComment.likesInfo.likesCount,
            dislikesCount: dbComment.likesInfo.dislikesCount,
            myStatus: likeStatus
        }
    }
}