import { PaginationAndSorting } from "../../core/types/pagination-and-sorting";
import { UserSortFields } from "./user-sort-fields";

export type UserQueryInput = PaginationAndSorting<UserSortFields> & 
Partial<{
    searchLoginTerm: string,
    searchEmailTerm: string
}>