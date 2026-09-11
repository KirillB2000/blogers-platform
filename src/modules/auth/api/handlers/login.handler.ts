import { Request, Response } from "express";
import { httpStatuses } from "../../../../core/types/http-statuses";
import { authService } from "../../application/auth.services";
import { LoginInputModel } from "../input/dto/loginInputModel";
import { LoginSuccessViewModel } from "../output/accessToken-output.type";


export const loginHandler = async (
    req: Request<{}, {}, LoginInputModel>,
    res: Response
) => {
    const loginInput = req.body
    const deviceName = req.headers['user-agent'] || 'Unknown device'
    const ipAddress = req.ip || 'Unknown ip address'

    const { accessToken, refreshToken } = await authService.loginUser(loginInput, deviceName, ipAddress)

    const accessTokenForResponse: LoginSuccessViewModel = { accessToken }

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true, 
        secure: true,
        sameSite: 'strict'
    })
    res.status(httpStatuses.Ok).json(accessTokenForResponse)
}