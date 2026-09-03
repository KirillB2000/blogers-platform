import { WithId } from "mongodb";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { mapToPaginatedOutput } from "../../../core/mappers/map-to-paginated-output";
import { mapUserDomaiToViewModel } from "./mapUserDomaiToViewModel";
import { UserListPaginatorOutput } from "../api/output/userListPaginatorOutput";
import { IUserDB } from "../domain/iUserDb";

export const mapToUserListPaginatedOutput = (
    items: WithId<IUserDB>[],
    meta: PagindatedOutput
): UserListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapUserDomaiToViewModel)
}