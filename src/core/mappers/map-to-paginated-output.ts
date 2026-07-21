import { PagindatedOutput } from "../types/paginated.output"


export const mapToPaginatedOutput = <IItem, TData> (
    items: IItem[],
    meta: {pagesCount: number, page: number, pageSize: number, totalCount: number},
    mapItem: (item: IItem) => TData,
): {pagesCount: number, page: number, pageSize: number, totalCount: number, items: TData[]} => {
    return {
        ...meta,
        items: items.map(mapItem)
    }
}