import { WithId } from "mongodb";
import { CommentDb } from "../domain/comment";
import { CommentListPaginatorOutput } from "../api/output/commentListPaginatorOutput";
import { mapFromCommentDbTypeToViewModel } from "./mapFromCommentDbTypeToViewModel";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";

export const mapToCommentListPaginatedOutput = (
    items: WithId<CommentDb>[],
    meta: PagindatedOutput
): CommentListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapFromCommentDbTypeToViewModel)
}