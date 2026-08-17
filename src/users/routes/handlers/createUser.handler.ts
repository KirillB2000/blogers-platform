import { Request, Response } from "express"
import { UserInputModel } from "../../input/dto/userInputModel"
import { ObjectId } from "mongodb"
import { usersService } from "../../application/users.services"
import { UserViewModel } from "../../output/userViewModel"
import { userQwRepository } from "../../repository/user.queryRepository"
import { httpStatuses } from "../../../core/types/http-statuses"

export const createUserHandler = async (
    req: Request<{}, {}, UserInputModel>, 
    res: Response
) => {
    const createdUserId: ObjectId = await usersService.create(req.body)

    const userForResponse: UserViewModel = await userQwRepository.findById(createdUserId)

    res.status(httpStatuses.Created).json(userForResponse)
}