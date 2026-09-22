import { WithId } from "mongodb";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapToBlogViewModel } from "./map-from-blog-db-type-to-view-model";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { BlogListPaginatedOutput } from "../api/output/blog-list-paginator.output";
import { BlogsDocument } from "../infrastructure/blogs.model";

export const mapToBlogListPaginatedOutput = (
    blogs: BlogsDocument[], 
    meta: PagindatedOutput
): BlogListPaginatedOutput => {
    return mapToPaginatedOutput(blogs, meta, mapToBlogViewModel)
}