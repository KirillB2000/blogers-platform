import { ObjectId, WithId } from "mongodb";
import { usersCollection } from "../../db/collections";
import { mapUserDomaiToViewModel } from "../mappers/mapUserDomaiToViewModel";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../output/userViewModel";
import { UserQueryInput } from "../input/user-query.input";
import { mapToUserListPaginatedOutput } from "../mappers/mapToUserListPaginatedOutput";
import { PagindatedOutput } from "../../core/types/paginated.output";
import { UserListPaginatorOutput } from "../output/userListPaginatorOutput";
import { MeViewModel } from "../../auth/output/me-output.type";
import { mapUserDomainToMeViewModel } from "../mappers/mapUserDomainToMeViewModel";
import { IUserDB } from "../input/domain/iUserDb";


export const userQwRepository = {
    
    async findMany (
        queryInput: UserQueryInput
    ): Promise<UserListPaginatorOutput> {
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
                filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' }})
            }
            if (searchLoginTerm) {
                filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' }})
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
    },

    async findByIdMe (
        id: string
    ): Promise<MeViewModel> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})

        if(!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const userMeForResponse: MeViewModel = mapUserDomainToMeViewModel(user)

        return userMeForResponse
    },

    async findByConfiramationCode(
        confirmationCode: string
    ) {
        const userByCode = await usersCollection.findOne({"emailConfirmation.confirmationCode": confirmationCode})

        if (!userByCode) {
            throw new BadRequestError([{ message: 'Code should be correct and exist in the system', field: 'code'}])
        }

        return userByCode
    },

    async findByEmail(
        email: string
    ): Promise<WithId<IUserDB>> {
        const userByEmail = await usersCollection.findOne({email: email})

        if (!userByEmail) {
            throw new BadRequestError([{message: 'Email should be correct and exist in the system', field: 'email'}])
        }

        return userByEmail
    }
}
