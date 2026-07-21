import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogListPaginatedOutput } from "../output/blog-list-paginator.output";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapToBlogViewModel } from "./map-from-blog-db-type-to-view-model";

export const mapToBlogListPaginatedOutput = (
    blogs: WithId<Blog>[], 
    meta: {pagesCount: number, page: number, pageSize: number, totalCount: number}
): BlogListPaginatedOutput => {
    return mapToPaginatedOutput(blogs, meta, mapToBlogViewModel)
}