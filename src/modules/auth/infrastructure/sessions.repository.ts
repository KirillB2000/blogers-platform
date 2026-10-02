import { injectable } from "inversify"
import { AuthSessionsDocument, AuthSessionsModel } from "./sessions.model"

@injectable()
export class SessionsRepository {

    async save (AuthSessionDoc: AuthSessionsDocument) {
        await AuthSessionDoc.save()
    }

    async delete(
        issuedAt: number,
        deviceId: string,
        userId: string
    ): Promise<boolean> {
        const deleteSessionResult = await AuthSessionsModel.deleteOne(
            { deviceId: deviceId, userId: userId, lastActiveDate: issuedAt }
        )

        return deleteSessionResult.deletedCount > 0
    }

    async deleteOne(
        deviceId: string
    ): Promise<void> {
        await AuthSessionsModel.deleteOne({deviceId: deviceId})
    }

    async deleteOtherSessions(
        deviceId: string, 
        userId: string
    ): Promise<void> {
        await AuthSessionsModel.deleteMany({ 
            userId: userId, 
            deviceId: {$ne: deviceId} 
        })
    }

    async findSession (
        issuedAt: number,
        deviceId: string,
        userId: string
    ): Promise<AuthSessionsDocument | null> {
        const session = await AuthSessionsModel.findOne({ deviceId: deviceId, userId: userId, lastActiveDate: issuedAt })

        return session
    }

    async findByDeviceId(
        deviceId: string
    ): Promise<AuthSessionsDocument | null> {
        const session = await AuthSessionsModel.findOne({deviceId: deviceId})

        return session
    }
}