import { CommentListPaginatorOutput } from "../api/output/commentListPaginatorOutput";
import { mapFromCommentDbTypeToViewModel } from "./mapFromCommentDbTypeToViewModel";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { CommentsDocument } from "../infrastructure/comments.model";

export const mapToCommentListPaginatedOutput = (
    items: CommentsDocument[],
    meta: PagindatedOutput
): CommentListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapFromCommentDbTypeToViewModel)
}