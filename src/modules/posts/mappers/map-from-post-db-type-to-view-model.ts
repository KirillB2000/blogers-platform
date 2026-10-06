import { LikeStatus } from "../../../core/types/likeStatus"
import { LikeDetailsViewModel } from "../api/output/postLikeDetailsViewModel"
import { PostViewModel } from "../api/output/postViewModel"
import { PostsDocument } from "../infrastructure/posts.model"

export const mapToPostViewModel = (
    postDoc: PostsDocument,
    likeStatus: LikeStatus,
    newestLikes: LikeDetailsViewModel[]
): PostViewModel => {
    return {
        id: postDoc._id.toString(),
        title: postDoc.title,
        shortDescription: postDoc.shortDescription,
        content: postDoc.content,
        blogId: postDoc.blogId,
        blogName: postDoc.blogName,
        createdAt: postDoc.createdAt,
        extendedLikesInfo: {
            likesCount: postDoc.extendedLikesInfo.likesCount,
            dislikesCount: postDoc.extendedLikesInfo.dislikesCount,
            myStatus: likeStatus,
            newestLikes: newestLikes.length === 0 ? [] : newestLikes
        }
    }
}