import { UnauthorizedError } from "../../../core/exceptions/app-errors.exeption"
import { jwtService } from "../adapters/jwt.services"
import { WithId } from "mongodb"
import { IUserDB } from "../../users/domain/iUserDb"
import { usersRepository } from "../../users/infrastructure/user.repository"
import { UUID } from "crypto"
import { RefreshTokenPayload } from "../api/input/jwtPayloadSessions"

export const authServiceHelpers = {
    async refreshTokenValidation (
        refreshToken: string
    ): Promise<{ userId: string, userById: WithId<IUserDB>, deviceId: UUID, issuedAt: number, expiredAt: Date }> {

        const payload = await jwtService.getUserIdByRefreshToken(refreshToken)

        if (!payload) {
            throw new UnauthorizedError('Unauthorized')
        }

        const fixedPayload: RefreshTokenPayload = {
            deviceId: payload.deviceId,
            exp: payload.exp * 1000,
            iat: payload.iat * 1000,
            jti: payload.jti,
            userId: payload.userId
        }

        const { exp, iat: issuedAt, deviceId, userId} = fixedPayload

        const expiredAt = new Date(exp)

        const userById = await usersRepository.findById(userId)

        if (!userById) {
            throw new UnauthorizedError('Unauthorized')
        }

        return { userId, userById, deviceId, issuedAt, expiredAt }
    }
}