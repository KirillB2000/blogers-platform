import { WithId } from "mongodb";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapToBlogViewModel } from "./map-from-blog-db-type-to-view-model";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { Blog } from "../domain/blog";
import { BlogListPaginatedOutput } from "../api/output/blog-list-paginator.output";

export const mapToBlogListPaginatedOutput = (
    blogs: WithId<Blog>[], 
    meta: PagindatedOutput
): BlogListPaginatedOutput => {
    return mapToPaginatedOutput(blogs, meta, mapToBlogViewModel)
}