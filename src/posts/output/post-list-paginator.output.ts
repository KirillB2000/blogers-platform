import { PostViewModel } from "./post-data.output";


export type PostListPaginatorOutput = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: PostViewModel[],
}