import { WithId } from "mongodb";
import { Post } from "../domain/post";
import { PostListPaginatorOutput } from "../api/output/post-list-paginator.output";
import { mapToPostViewModel } from "./map-from-post-db-type-to-view-model";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";

export const mapToPostListPaginatedOutput = (
    items: WithId<Post>[],
    meta: PagindatedOutput
): PostListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapToPostViewModel)
}