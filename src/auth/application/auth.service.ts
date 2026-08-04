import { UnauthorizedError } from "../../core/exceptions/app-errors.exeption";
import { usersRepository } from "../../users/repository/user.repository";
import { LoginInputModel } from "../dto/authInputModel";
import bcrypt from 'bcrypt'

export const authService = {
    async checkUserCredentials (
        userCreds: LoginInputModel
    ): Promise<void> {
        const user = await usersRepository.findByLoginOrEmailField(userCreds.loginOrEmail)

        if (!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const isPasswordCorrect = await bcrypt.compare(userCreds.password, user.password)
        if (!isPasswordCorrect) {
            throw new UnauthorizedError('Unauthorized')
        }
    }
}