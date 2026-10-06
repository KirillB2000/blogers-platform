import { PostListPaginatorOutput } from "../api/output/post-list-paginator.output";
import { mapToPostViewModel } from "./map-from-post-db-type-to-view-model";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { PostsDocument } from "../infrastructure/posts.model";
import { LikeStatus } from "../../../core/types/likeStatus";
import { PostLikesStatusType } from "../infrastructure/postsLikesStatus.model";

export const mapToPostListPaginatedOutput = (
    items: PostsDocument[],
    meta: PagindatedOutput,
    postLikesMap: Record<string, LikeStatus>,
    allLikesDb: PostLikesStatusType[]
): PostListPaginatorOutput => {
    return mapToPaginatedOutput(
        items, 
        meta,
        (post) => {
            const postId = post._id.toString();
            const myStatus = postLikesMap[postId] || LikeStatus.None;

            const newestLikes = allLikesDb
                .filter(like => like.postId === postId)
                .slice(0, 3)
                .map(like => ({
                    addedAt: like.addedAt,
                    userId: like.userId,
                    login: like.login
                }));
            
            return mapToPostViewModel(post, myStatus, newestLikes)
        } 
    )
} 