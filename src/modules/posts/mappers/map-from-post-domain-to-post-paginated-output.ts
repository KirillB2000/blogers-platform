import { PostListPaginatorOutput } from "../api/output/post-list-paginator.output";
import { mapToPostViewModel } from "./map-from-post-db-type-to-view-model";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { PostsDocument } from "../infrastructure/posts.model";

export const mapToPostListPaginatedOutput = (
    items: PostsDocument[],
    meta: PagindatedOutput
): PostListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapToPostViewModel)
}