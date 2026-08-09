import { WithId } from "mongodb";
import { UnauthorizedError } from "../../core/exceptions/app-errors.exeption";
import { usersRepository } from "../../users/repository/user.repository";
import { LoginInputModel } from "../dto/authInputModel";
import bcrypt from 'bcrypt'
import { User } from "../../users/domain/user";

export const authService = {
    async checkUserCredentials (
        userCreds: LoginInputModel
    ): Promise<WithId<User>> {
        const user = await usersRepository.findByLoginOrEmailField(userCreds.loginOrEmail)

        if (!user) {
            throw new UnauthorizedError('Unauthorized')
        }

        const isPasswordCorrect = await bcrypt.compare(userCreds.password, user.password)
        if (!isPasswordCorrect) {
            throw new UnauthorizedError('Unauthorized')
        }

        return user
    }
}