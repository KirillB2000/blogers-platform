import { UserViewModel } from "./userViewModel"

export type UserListPaginatorOutput = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: UserViewModel[]
}