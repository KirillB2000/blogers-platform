import { WithId } from "mongodb";
import { BadRequestError, UnauthorizedError } from "../../core/exceptions/app-errors.exeption";
import { usersRepository } from "../../users/repository/user.repository";
import { LoginInputModel } from "../input/dto/loginInputModel";
import { UserInputModel } from "../../users/input/dto/userInputModel";
import { bcryptService } from "../adapters/bcrypt.services";
import { mapUserInputToIDbType } from "../../users/mappers/mapUserInputToIDbType";
import { nodemailerService } from "../adapters/nodemailer.services";
import { emailExamples } from "../adapters/emailExamples";
import { IUserDB } from "../../users/input/domain/iUserDb";
import { isAfter, add } from "date-fns";
import { randomUUID } from "node:crypto";
import { jwtService } from "../adapters/jwt.services";
import { sessionsRepository } from "../infrastructure/sessions.repository";
import { authServiceHelpers } from "./auth.serviceHelpers";

export const authService = {
    async loginUser (
        userCreds: LoginInputModel
    ): Promise<{ accessToken: string, refreshToken: string }> {
        const user = await usersRepository.findByLoginOrEmailField(userCreds.loginOrEmail)

        if (!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const isPasswordCorrect = await bcryptService.checkPassword(userCreds.password, user.password)
        if (!isPasswordCorrect) {
            throw new UnauthorizedError('Unauthorized')
        }

        const accessToken = await jwtService.createAccessJWT(user)
        const refreshToken = await jwtService.createRefreshJWT(user)

        return { accessToken, refreshToken }
    },

    async registerUser(
        userDto: UserInputModel
    ): Promise<void> {

        const existingUserEmail = await usersRepository.findByEmail(userDto.email)
        if (existingUserEmail) {
            throw new BadRequestError([{ message: 'Email must be unique', field: 'email' }])
        }

        const existingUserLogin = await usersRepository.findByLogin(userDto.login)
        if (existingUserLogin) {
            throw new BadRequestError([{ message: 'Login must be unique', field: 'login' }])
        }

        const passwordHash = await bcryptService.generateHash(userDto.password)

        const dbUser = mapUserInputToIDbType(userDto, passwordHash)

        await usersRepository.create(dbUser)

        nodemailerService
        .sendEmail(
            dbUser.email,
            dbUser.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
        )
        .catch(er => console.error(`Error occured while sending an email: ${er}`))
    },

    async emailConfirmation(
        user: WithId<IUserDB>
    ): Promise<void> {
        const expiryDate = user.emailConfirmation.expirationDate
        if (isAfter(new Date(), expiryDate)) {
            throw new BadRequestError([{message: 'Code expired', field: 'code'}])
        }

        const isCofirmed = user.emailConfirmation.isConfirmed
        if (isCofirmed) {
            throw new BadRequestError([{ message: 'Email already confirmed', field: 'code' }])
        }

        const userId = user._id.toString()

        await usersRepository.confirmEmail(userId)
    },

    async emailResending(
        user: WithId<IUserDB>
    ): Promise<void> {
        const isConfirmed = user.emailConfirmation.isConfirmed
        if (isConfirmed) {
            throw new BadRequestError([{message: 'Email already confirned', field: 'email'}])
        }

        const userId = user._id.toString()
        const newCode = randomUUID()
        const newExpirationDate = add(new Date(), {minutes: 5})

        await usersRepository.updateConfirmationCode(userId, newCode, newExpirationDate)

        await nodemailerService.sendEmail(
            user.email,
            newCode,
            emailExamples.registrationEmail
        ).catch(er => console.error(`Error occured while sending an email: ${er}`))
    },

    async refreshToken (
        refreshToken: string
    ): Promise<{ newAccessToken: string, newRefreshToken: string}> {

        const { userId, expirationDate, userById } = await authServiceHelpers.refreshValidation(refreshToken)

        const refreshTokenForDb: RefreshTokenDb = {
            userId: userId,
            expirationDate: expirationDate,
            token: refreshToken
        }

        await sessionsRepository.create(refreshTokenForDb)

        const newAccessToken = await jwtService.createAccessJWT(userById)
        const newRefreshToken = await jwtService.createRefreshJWT(userById)

        return { newAccessToken, newRefreshToken }
    },

    async logout (
        refreshToken: string
    ) {
        const { userId, expirationDate } = await authServiceHelpers.refreshValidation(refreshToken)

        const refreshTokenForDb: RefreshTokenDb = {
            userId: userId,
            expirationDate: expirationDate,
            token: refreshToken
        }

        await sessionsRepository.create(refreshTokenForDb)
    }
}