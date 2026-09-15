import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { LoginInputModel } from "./input/dto/loginInputModel";
import { LoginSuccessViewModel } from "./output/accessToken-output.type";
import { AuthService } from "../application/auth.services";
import { UsersQwRepository } from "../../users/infrastructure/user.queryRepository";
import { UserInputModel } from "../../users/api/input/dto/userInputModel";
import { RegistrationConfirmationCodeInputModel } from "./input/dto/registrationConfirmationCodeInputModel";
import { RegistrationEmailResendingInputModel } from "./input/dto/registrationEmailResendingInputModel";


export class AuthController {

    constructor (
        private authService: AuthService,
        private usersQwRepository: UsersQwRepository
    ) {}

    async loginHandler (
        req: Request<{}, {}, LoginInputModel>,
        res: Response
    ) {
        const loginInput = req.body
        const deviceName = req.headers['user-agent'] || 'Unknown device'
        const ipAddress = req.ip || 'Unknown ip address'

        const { accessToken, refreshToken } = await this.authService.loginUser(loginInput, deviceName, ipAddress)

        const accessTokenForResponse: LoginSuccessViewModel = { accessToken }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        res.status(httpStatuses.Ok).json(accessTokenForResponse)
    }

    async logoutHandler (
        req: Request,
        res: Response
    ) {
        const { refreshToken } = req.cookies as AuthCookies

        if (!refreshToken) {
            return res.sendStatus(httpStatuses.Unauthorized)
        }

        await this.authService.logout(refreshToken)
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })

        res.sendStatus(httpStatuses.NoContent)
    }

    async meHandler (
        req: Request, 
        res: Response
    ) {
        const userId = req.user?.id as string;
        if (!userId) return res.sendStatus(httpStatuses.Unauthorized)

        const me = await this.usersQwRepository.findByIdMe(userId)

        res.status(httpStatuses.Ok).json(me)
    }

    async refreshTokenHandler (
        req: Request,
        res: Response
    ) {
        const { refreshToken } = req.cookies as AuthCookies

        if (!refreshToken) {
            return res.sendStatus(httpStatuses.Unauthorized)
        }

        const { newRefreshToken, newAccessToken } = await this.authService.refreshToken(refreshToken)

        const newAccessTokenForResponse: LoginSuccessViewModel = { accessToken: newAccessToken }

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict" })
        res.status(httpStatuses.Ok).json(newAccessTokenForResponse)
    }

    async registrationHandler (
        req: Request<{}, {}, UserInputModel>,
        res: Response
    ) {
        const userDto = req.body

        await this.authService.registerUser(userDto)

        res.sendStatus(httpStatuses.NoContent) 
    }

    async registrationConfirmationHandler (
        req: Request<{}, {}, RegistrationConfirmationCodeInputModel>,
        res: Response
    ) {
        const { code } = req.body

        const userByCode = await this.usersQwRepository.findByConfiramationCode(code)

        await this.authService.emailConfirmation(userByCode)

        res.sendStatus(httpStatuses.NoContent)
    }

    async registrationEmailResendingHandler (
        req: Request<{}, {}, RegistrationEmailResendingInputModel>,
        res: Response
    ) {
        const { email } = req.body
        const userByEmail = await this.usersQwRepository.findByEmail(email)

        await this.authService.emailResending(userByEmail)

        res.sendStatus(httpStatuses.NoContent)
    }
}