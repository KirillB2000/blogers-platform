import { WithId } from "mongodb";
import { UserListPaginatorOutput } from "../output/userListPaginatorOutput";
import { IUserDB } from "../input/domain/iUserDb";
import { PagindatedOutput } from "../../core/types/paginated.output";
import { mapToPaginatedOutput } from "../../core/mappers/map-to-paginated-output";
import { mapUserDomaiToViewModel } from "./mapUserDomaiToViewModel";

export const mapToUserListPaginatedOutput = (
    items: WithId<IUserDB>[],
    meta: PagindatedOutput
): UserListPaginatorOutput => {
    return mapToPaginatedOutput(items, meta, mapUserDomaiToViewModel)
}