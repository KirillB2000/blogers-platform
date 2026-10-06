import { CommentListPaginatorOutput } from "../api/output/commentListPaginatorOutput";
import { mapFromCommentDbTypeToViewModel } from "./mapFromCommentDbTypeToViewModel";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { CommentsDocument } from "../infrastructure/comments.model";
import { LikeStatus } from "../../../core/types/likeStatus";

export const mapToCommentListPaginatedOutput = (
    items: CommentsDocument[],
    meta: PagindatedOutput,
    likesMap: Record<string, LikeStatus>
): CommentListPaginatorOutput => {
    return mapToPaginatedOutput(
        items, 
        meta, 
        (comment) => {
            const myStatus = likesMap[comment._id.toString()] || LikeStatus.None // параметр функции likesMap доступен благодаря замыканию

            return mapFromCommentDbTypeToViewModel(comment, myStatus)
        }
    )
}