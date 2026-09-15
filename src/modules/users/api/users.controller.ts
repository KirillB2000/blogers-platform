import { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { httpStatuses } from "../../../core/types/http-statuses"
import { UserInputModel } from "./input/dto/userInputModel"
import { UserViewModel } from "./output/userViewModel"
import { UsersService } from "../application/users.services"
import { UsersQwRepository } from "../infrastructure/user.queryRepository"
import { UserQueryInput } from "./input/user-query.input"
import { UserListPaginatorOutput } from "./output/userListPaginatorOutput"

export class UsersController {
    constructor (
        private usersService: UsersService,
        private usersQwRepository: UsersQwRepository
    ) {}

    async createUserHandler (
        req: Request<{}, {}, UserInputModel>,
        res: Response
    ) {
        const createdUserId: ObjectId = await this.usersService.create(req.body)

        const userForResponse: UserViewModel = await this.usersQwRepository.findById(createdUserId)

        res.status(httpStatuses.Created).json(userForResponse)
    }

    async deleteUserHandler (
        req: Request<{ id: string }>,
        res: Response
    ) {
        await this.usersService.delete(req.params.id)

        res.sendStatus(httpStatuses.NoContent)
    }

    async getUserListHandler (
        req: Request<{}, {}, {}, UserQueryInput>,
        res: Response
    ) {
        const queryInput = req.query
        const userListWithPagination: UserListPaginatorOutput = await this.usersQwRepository.findMany(queryInput)

        res.status(httpStatuses.Ok).json(userListWithPagination)
    }
}