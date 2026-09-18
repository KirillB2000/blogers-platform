import { UnauthorizedError } from "../../../core/exceptions/app-errors.exeption"
import { WithId } from "mongodb"
import { IUserDB } from "../../users/domain/iUserDb"
import { UUID } from "crypto"
import { RefreshTokenPayload } from "../api/input/jwtPayloadSessions"
import { JwtService } from "../adapters/jwt.services"
import { UsersRepository } from "../../users/infrastructure/user.repository"
import { injectable } from "inversify"

@injectable()
export class AuthServiceHelpers {

    constructor(
        private userRepository: UsersRepository,
        private jwtService: JwtService
    ) {}

    async refreshTokenValidation (
        refreshToken: string
    ): Promise<{ userId: string, userById: WithId<IUserDB>, deviceId: UUID, issuedAt: number, expiredAt: Date }> {

        const payload = await this.jwtService.getUserIdByRefreshToken(refreshToken)

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

        const userById = await this.userRepository.findById(userId)

        if (!userById) {
            throw new UnauthorizedError('Unauthorized')
        }

        return { userId, userById, deviceId, issuedAt, expiredAt }
    }
}