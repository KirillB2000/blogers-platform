import { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { usersService } from "../../application/users.services"
import { httpStatuses } from "../../../../core/types/http-statuses"
import { userQwRepository } from "../../infrastructure/user.queryRepository"
import { UserInputModel } from "../input/dto/userInputModel"
import { UserViewModel } from "../output/userViewModel"

export const createUserHandler = async (
    req: Request<{}, {}, UserInputModel>, 
    res: Response
) => {
    const createdUserId: ObjectId = await usersService.create(req.body)

    const userForResponse: UserViewModel = await userQwRepository.findById(createdUserId)

    res.status(httpStatuses.Created).json(userForResponse)
}