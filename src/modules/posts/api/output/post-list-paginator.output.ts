import { PostViewModel } from "./postViewModel";


export type PostListPaginatorOutput = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: PostViewModel[],
}