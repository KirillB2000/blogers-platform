import { UnauthorizedError } from "../../../core/exceptions/app-errors.exeption"
import { jwtService } from "../adapters/jwt.services"
import { WithId } from "mongodb"
import { IUserDB } from "../../users/domain/iUserDb"
import { usersRepository } from "../../users/infrastructure/user.repository"
import { UUID } from "crypto"

export const authServiceHelpers = {
    async refreshTokenValidation (
        refreshToken: string
    ): Promise<{ userId: string, userById: WithId<IUserDB>, deviceId: UUID, issuedAt: number }> {

        const payload = await jwtService.getUserIdByRefreshToken(refreshToken)

        if (!payload) {
            throw new UnauthorizedError('Unauthorized')
        }

        let { userId, iat: issuedAt, deviceId } = payload

        const userById = await usersRepository.findById(userId)

        if (!userById) {
            throw new UnauthorizedError('Unauthorized')
        }

        return { userId, userById, deviceId, issuedAt }
    }
}