import { UUID } from "crypto";
import { authServiceHelpers } from "../../../auth/application/auth.serviceHelpers";
import { sessionsRepository } from "../../../auth/infrastructure/sessions.repository";
import { ForbiddenError, NotFoundError } from "../../../../core/exceptions/app-errors.exeption";

export const securityDevicesServices = {
    async deleteOneSession (
        deviceId: UUID,
        refreshToken: string
    ): Promise<void> {
        const { userId: userByRefreshToken } = await authServiceHelpers.refreshTokenValidation(refreshToken)

        const session = await sessionsRepository.findByDeviceId(deviceId)

        if(!session) {
            throw new NotFoundError('Session is not found')
        }

        if (userByRefreshToken !== session.userId) {
            throw new ForbiddenError("You don't have permission to terminate this session")
        }

        await sessionsRepository.deleteOne(deviceId) // Earlier we have already checked for the existence of the session
    },

    async deleteAllSessions (
        refreshToken: string
    ): Promise<void> {
        const { deviceId, userId } = await authServiceHelpers.refreshTokenValidation(refreshToken)

        await sessionsRepository.deleteOtherSessions(deviceId, userId)
    }
}