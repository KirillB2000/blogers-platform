import { ObjectId } from "mongodb";
import { mapUserDomaiToViewModel } from "../mappers/mapUserDomaiToViewModel";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../../../core/exceptions/app-errors.exeption";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { MeViewModel } from "../../auth/api/output/me-output.type";
import { UserQueryInput } from "../api/input/user-query.input";
import { UserListPaginatorOutput } from "../api/output/userListPaginatorOutput";
import { UserViewModel } from "../api/output/userViewModel";
import { mapToUserListPaginatedOutput } from "../mappers/mapToUserListPaginatedOutput";
import { mapUserDomainToMeViewModel } from "../mappers/mapUserDomainToMeViewModel";
import { injectable } from "inversify";
import { UsersDocument, UsersModel } from "./users.model";


@injectable()
export class UsersQwRepository {
    
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

        const items = await UsersModel
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)

        const totalCount = await UsersModel.countDocuments(filter)
        const pageCount = Math.ceil(totalCount / pageSize)

        const meta: PagindatedOutput = {
            pagesCount: pageCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount
        }
        
        const userListWithPagination: UserListPaginatorOutput = mapToUserListPaginatedOutput(items, meta)

        return userListWithPagination

    }

    async findById (
        id: string
    ): Promise<UserViewModel> {
        const user = await UsersModel.findOne({_id: new ObjectId(id)})

        if(!user) {
            throw new NotFoundError('User not found')
        }

        const userForResponse: UserViewModel = mapUserDomaiToViewModel(user)

        return userForResponse
    }

    async findByIdMe (
        id: string
    ): Promise<MeViewModel> {
        const user = await UsersModel.findOne({_id: new ObjectId(id)})

        if(!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const userMeForResponse: MeViewModel = mapUserDomainToMeViewModel(user)

        return userMeForResponse
    }

    async findByConfiramationCode(
        confirmationCode: string
    ) {
        const userByCode = await UsersModel.findOne({"emailConfirmation.confirmationCode": confirmationCode})

        if (!userByCode) {
            throw new BadRequestError([{ message: 'Code should be correct and exist in the system', field: 'code'}])
        }

        return userByCode
    }

    async findByEmail(
        email: string
    ): Promise<UsersDocument> {
        const userByEmail = await UsersModel.findOne({email: email})

        if (!userByEmail) {
            throw new BadRequestError([{message: 'Email should be correct and exist in the system', field: 'email'}])
        }

        return userByEmail
    }
}
