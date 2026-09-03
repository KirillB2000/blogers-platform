import { CommentViewModel } from "./commentViewModel"

export type CommentListPaginatorOutput = {
    pagesCount?: number,
    page?: number,
    pageSize?: number,
    totalCount?: number,
    items: CommentViewModel[]
}