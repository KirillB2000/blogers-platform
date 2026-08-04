import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/collections";
import { mapUserDomaiToViewModel } from "../mappers/mapUserDomaiToViewModel";
import { NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../output/userViewModel";
import { UserQueryInput } from "../input/user-query.input";
import { mapToUserListPaginatedOutput } from "../mappers/mapToUserListPaginatedOutput";
import { PagindatedOutput } from "../../core/types/paginated.output";
import { UserListPaginatorOutput } from "../output/userListPaginatorOutput";


export const userQwRepository = {
    
    async findMany (
        queryInput: UserQueryInput
    ): Promise<UserListPaginatorOutput> { // Надо переделать так, чтобы маппинг в Paginator<UserViewModel> был тут (также поменять в блогах)
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchEmailTerm,
            searchLoginTerm
        } = queryInput

        const skip = (pageNumber - 1) * pageSize
        const filter: any = {}

        if (searchEmailTerm || searchLoginTerm) {
            filter.$or = [];
            if (searchEmailTerm) {
                filter.$or.push({ name: { $regex: searchEmailTerm, $options: 'i' }})
            }
            if (searchLoginTerm) {
                filter.$or.push({ name: { $regex: searchLoginTerm, $options: 'i' }})
            }
        }

        const items = await usersCollection
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray()

        const totalCount = await usersCollection.countDocuments(filter)
        const pageCount = Math.ceil(totalCount / pageSize)

        const meta: PagindatedOutput = {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount
        }
        
        const userListWithPagination: UserListPaginatorOutput = mapToUserListPaginatedOutput(items, meta)

        return userListWithPagination

    },

    async findById (
        id: string | ObjectId
    ): Promise<UserViewModel> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})

        if(!user) {
            throw new NotFoundError('User not found')
        }

        const userForResponse: UserViewModel = mapUserDomaiToViewModel(user)

        return userForResponse
    }
}