import { isAfter } from "date-fns"
import { UnauthorizedError } from "../../core/exceptions/app-errors.exeption"
import { usersRepository } from "../../users/repository/user.repository"
import { jwtService } from "../adapters/jwt.services"
import { sessionsRepository } from "../infrastructure/sessions.repository"
import { WithId } from "mongodb"
import { IUserDB } from "../../users/input/domain/iUserDb"

export const authServiceHelpers = {
    async refreshValidation (
        refreshToken: string
    ): Promise<{ userId: string, expirationDate: Date, userById: WithId<IUserDB> }> {
        const blackListedToken = await sessionsRepository.findByToken(refreshToken)

        if (blackListedToken) {
            throw new UnauthorizedError('Unauthorized')
        }

        const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

        if (!userId) {
            throw new UnauthorizedError('Unauthorized')
        }

        const userById = await usersRepository.findById(userId)

        if (!userById) {
            throw new UnauthorizedError('Unauthorized')
        }

        const expirationDate = await jwtService.getExpirationDateByRefreshToken(refreshToken)

        if (!expirationDate) {
            throw new UnauthorizedError('Unauthorized')
        }

        if (isAfter(new Date(), expirationDate)) {
            throw new UnauthorizedError('Unauthorized')
        }

        return { userId, expirationDate, userById }
    }
}