import { WithId } from "mongodb";
import { CommentDb } from "../input/comment";
import { PagindatedOutput } from "../../core/types/paginated.output";
import { CommentListPaginatorOutput } from "../output/commentListPaginatorOutput";
import { mapToPaginatedOutput } from "../../core/mappers/map-to-paginated-output";
import { mapFromCommentDbTypeToViewModel } from "./mapFromCommentDbTypeToViewModel";

export const mapToCommentListPaginatedOutput = (
    items: WithId<CommentDb>[],
    meta: PagindatedOutput
): CommentListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapFromCommentDbTypeToViewModel)
}