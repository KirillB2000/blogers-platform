import { BlogViewModel } from "./blog-data.output";


export type BlogListPaginatedOutput = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: BlogViewModel[]
}