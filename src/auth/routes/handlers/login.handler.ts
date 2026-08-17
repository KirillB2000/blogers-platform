import { Request, Response } from "express";
import { LoginInputModel } from "../../input/dto/loginInputModel";
import { authService } from "../../domain/auth.services";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { IUserDB } from "../../../users/input/domain/iUserDb";
import { LoginSuccessViewModel } from "../../output/accessToken-output.type";
import { jwtService } from "../../adapters/jwt.services";
export const loginHandler = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response
) => {
    const user: WithId<IUserDB> = await authService.loginUser(req.body)

    const token: LoginSuccessViewModel = await jwtService.createJWT(user)

    res.status(httpStatuses.Ok).json(token)
}