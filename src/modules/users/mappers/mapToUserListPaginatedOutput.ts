import { PagindatedOutput } from "../../../core/types/paginated.output";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapUserDomaiToViewModel } from "./mapUserDomaiToViewModel";
import { UserListPaginatorOutput } from "../api/output/userListPaginatorOutput";
import { UsersDocument } from "../infrastructure/users.model";

export const mapToUserListPaginatedOutput = (
    items: UsersDocument[],
    meta: PagindatedOutput
): UserListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapUserDomaiToViewModel)
}