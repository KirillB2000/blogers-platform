import { UUID } from "crypto";
import { ForbiddenError, NotFoundError } from "../../../../core/exceptions/app-errors.exeption";
import { AuthServiceHelpers } from "../../../auth/application/auth.serviceHelpers";
import { SessionsRepository } from "../../../auth/infrastructure/sessions.repository";
import { injectable } from "inversify";

@injectable()
export class SecurityDevicesService {
    constructor (
        private authServiceHelpers: AuthServiceHelpers,
        private sessionsRepository: SessionsRepository
    ) {}

    async deleteOneSession (
        deviceId: UUID,
        refreshToken: string
    ): Promise<void> {
        const { userId: userByRefreshToken } = await this.authServiceHelpers.refreshTokenValidation(refreshToken)

        const session = await this.sessionsRepository.findByDeviceId(deviceId)

        if(!session) {
            throw new NotFoundError('Session is not found')
        }

        if (userByRefreshToken !== session.userId) {
            throw new ForbiddenError("You don't have permission to terminate this session")
        }

        await this.sessionsRepository.deleteOne(deviceId) // Earlier we have already checked for the existence of the session
    }

    async deleteAllSessions (
        refreshToken: string
    ): Promise<void> {
        const { deviceId, userId } = await this.authServiceHelpers.refreshTokenValidation(refreshToken)

        await this.sessionsRepository.deleteOtherSessions(deviceId, userId)
    }
}