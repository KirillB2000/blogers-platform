import { Request, Response } from "express";
import { LoginInputModel } from "../../dto/authInputModel";
import { authService } from "../../application/auth.service";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { User } from "../../../users/domain/user";
import { LoginSuccessViewModel } from "../../output/accessToken-output.type";
import { jwtService } from "../../application/jwt.service";
export const authHandler = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response
) => {
    const user: WithId<User> = await authService.checkUserCredentials(req.body)

    const token: LoginSuccessViewModel = await jwtService.createJWT(user)

    res.status(httpStatuses.Ok).json(token)
}