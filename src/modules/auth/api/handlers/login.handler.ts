import { Request, Response } from "express";
import { httpStatuses } from "../../../../core/types/http-statuses";
import { authService } from "../../application/auth.services";
import { LoginInputModel } from "../input/dto/loginInputModel";
import { LoginSuccessViewModel } from "../output/accessToken-output.type";


export const loginHandler = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response
) => {
    const {accessToken, refreshToken} = await authService.loginUser(req.body)

    const accessTokenForResponse: LoginSuccessViewModel = { accessToken }

    res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite: 'strict', secure: true})
    res.status(httpStatuses.Ok).json(accessTokenForResponse)
}