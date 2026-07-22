import { WithId } from "mongodb";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { Post } from "../../domain/post";
import { PostListPaginatorOutput } from "../output/post-list-paginator.output";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapToPostViewModel } from "./map-from-post-db-type-to-view-model";

export const mapToPostListPaginatedOutput = (
    items: WithId<Post>[],
    meta: PagindatedOutput
): PostListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapToPostViewModel)
}