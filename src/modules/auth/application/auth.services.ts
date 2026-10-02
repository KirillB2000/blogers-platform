import { BadRequestError, UnauthorizedError } from "../../../core/exceptions/app-errors.exeption";
import { LoginInputModel } from "../api/input/dto/loginInputModel";
import { BcryptService } from "../adapters/bcrypt.services";
import { mapUserInputToIDbType } from "../../users/mappers/mapUserInputToIDbType";
import { NodemailerService } from "../adapters/nodemailer.services";
import { emailExamples } from "../adapters/emailExamples";
import { isAfter, add } from "date-fns";
import { randomUUID } from "node:crypto";
import { UserInputModel } from "../../users/api/input/dto/userInputModel";
import { SessionsRepository } from "../infrastructure/sessions.repository";
import { AuthServiceHelpers } from "./auth.serviceHelpers";
import { JwtService } from "../adapters/jwt.services";
import { UsersRepository } from "../../users/infrastructure/user.repository";
import { inject, injectable } from "inversify";
import { UsersDocument, UsersModel } from "../../users/infrastructure/users.model";
import { AuthSessionsModel, AuthSessionsType } from "../infrastructure/sessions.model";

@injectable()
export class AuthService {
    constructor(
        @inject(SessionsRepository) private sessionsRepository: SessionsRepository, 
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(AuthServiceHelpers) private authServiceHelpers: AuthServiceHelpers,
        @inject(JwtService) private jwtService: JwtService,
        @inject(BcryptService) private bcryptService: BcryptService,
        @inject(NodemailerService) private nodemailerService: NodemailerService
    ) {}

    async loginUser (
        userCreds: LoginInputModel,
        deviceName: string,
        ipAddress: string
    ): Promise<{ accessToken: string, refreshToken: string }> {
        const deviceId = randomUUID()
        const user = await this.usersRepository.findByLoginOrEmailField(userCreds.loginOrEmail)

        if (!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const isPasswordCorrect = await this.bcryptService.checkPassword(userCreds.password, user.password)
        if (!isPasswordCorrect) {
            throw new UnauthorizedError('Unauthorized')
        }

        const accessToken = await this.jwtService.createAccessJWT(user)
        const { refreshToken, issuedAt, expiredAt } = await this.jwtService.createRefreshJWT(user, deviceId)

        const sessionForDb: AuthSessionsType = {
            userId: user._id.toString(),
            deviceId: deviceId,
            title: deviceName,
            expirationDate: expiredAt!,
            lastActiveDate: issuedAt!,
            ip: ipAddress
        }

        const authSessionDoc = new AuthSessionsModel(sessionForDb)

        await this.sessionsRepository.save(authSessionDoc)

        return { accessToken, refreshToken }
    }

    async registerUser(
        userDto: UserInputModel
    ): Promise<void> {

        const existingUserEmail = await this.usersRepository.findByEmail(userDto.email)
        if (existingUserEmail) {
            throw new BadRequestError([{ message: 'Email must be unique', field: 'email' }])
        }

        const existingUserLogin = await this.usersRepository.findByLogin(userDto.login)
        if (existingUserLogin) {
            throw new BadRequestError([{ message: 'Login must be unique', field: 'login' }])
        }

        const passwordHash = await this.bcryptService.generateHash(userDto.password)

        const dbUser = mapUserInputToIDbType(userDto, passwordHash)

        const user = new UsersModel(dbUser)

        await this.usersRepository.save(user)

        this.nodemailerService
        .sendEmail(
            user.email,
            user.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
        )
        .catch(er => console.error(`Error occured while sending an email: ${er}`))
    }

    async emailConfirmation(
        user: UsersDocument
    ): Promise<void> {
        const expiryDate = user.emailConfirmation.expirationDate
        if (isAfter(new Date(), expiryDate)) {
            throw new BadRequestError([{message: 'Code expired', field: 'code'}])
        }

        const isCofirmed = user.emailConfirmation.isConfirmed
        if (isCofirmed) {
            throw new BadRequestError([{ message: 'Email already confirmed', field: 'code' }])
        }

        user.emailConfirmation.isConfirmed = true

        await this.usersRepository.save(user)
    }

    async emailResending(
        user: UsersDocument
    ): Promise<void> {
        const isConfirmed = user.emailConfirmation.isConfirmed
        if (isConfirmed) {
            throw new BadRequestError([{message: 'Email already confirned', field: 'email'}])
        }

        const newCode = randomUUID()
        const newExpirationDate = add(new Date(), {minutes: 5})

        user.emailConfirmation.confirmationCode = newCode
        user.emailConfirmation.expirationDate = newExpirationDate

        await this.usersRepository.save(user)

        this.nodemailerService
        .sendEmail(
            user.email,
            newCode,
            emailExamples.registrationEmail
        )
        .catch(er => console.error(`Error occured while sending an email: ${er}`))
    }

    async refreshToken (
        refreshToken: string
    ): Promise<{ newAccessToken: string, newRefreshToken: string}> {

        const { userById, userId, deviceId, issuedAt: issuedAtOld } = await this.authServiceHelpers.refreshTokenValidation(refreshToken)

        
        const { expiredAt: expiredAtNew, refreshToken: newRefreshToken, issuedAt: issuedAtNew } = await this.jwtService.createRefreshJWT(userById, deviceId)

        const authSessionDoc = await this.sessionsRepository.findSession(issuedAtOld, deviceId, userId)

        if (!authSessionDoc) {
            throw new UnauthorizedError('Unauthorized')
        }

        authSessionDoc.lastActiveDate = issuedAtNew
        authSessionDoc.expirationDate = expiredAtNew

        await this.sessionsRepository.save(authSessionDoc) // Update version of the token (session)

        const newAccessToken = await this.jwtService.createAccessJWT(userById)

        return { newAccessToken, newRefreshToken }
    }

    async logout (
        refreshToken: string
    ): Promise<void> {
        const { issuedAt, deviceId, userId } = await this.authServiceHelpers.refreshTokenValidation(refreshToken)

        const isDeleted = await this.sessionsRepository.delete(issuedAt, deviceId, userId)

        if(!isDeleted) {
            throw new UnauthorizedError('Unauthorized')
        }
    }

    async passwordRecovery (
        email: string
    ): Promise<void> {

        const userByEmail = await this.usersRepository.findByEmail(email)

        if (!userByEmail) {
            return
        }

        const recoveryCode = randomUUID()
        const expirationDate = add(new Date(), { minutes: 5 })

        userByEmail.passwordRecovery.recoveryCode = recoveryCode
        userByEmail.passwordRecovery.expirationDate = expirationDate

        await this.usersRepository.save(userByEmail)

        this.nodemailerService
            .sendEmail(
                email,
                recoveryCode,
                emailExamples.recoveryPasswordEmail
            )
            .catch(er => console.error(`Error occured while sending an email: ${er}`))
    }

    async updatePassword (
        newPassword: string, 
        recoveryCode: string
    ): Promise<void> {

        const user = await  this.usersRepository.findByRecoveryCode(recoveryCode)

        if (!user) {
            throw new BadRequestError([{ message: 'Invalid recovery code', field: 'recoveryCode'}])
        }

        if(user.passwordRecovery.expirationDate! < new Date()) {
            throw new BadRequestError([{ message: 'Recovery code is expired', field: 'recoveryCode'}])
        }

        const newHashedPassword = await this.bcryptService.generateHash(newPassword)

        user.password = newHashedPassword
        user.passwordRecovery.recoveryCode = null
        user.passwordRecovery.expirationDate = null

        await this.usersRepository.save(user)
    }
}