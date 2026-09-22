import { injectable } from "inversify"
import { AuthSessionsDocument, AuthSessionsModel, AuthSessionsType } from "./sessions.model"

@injectable()
export class SessionsRepository {
    async create (
        sessionInfo: AuthSessionsType
    ): Promise<String> {
        const blackListedTokenId = await AuthSessionsModel.insertOne(sessionInfo)

        const tokenInfoId = blackListedTokenId.id

        return tokenInfoId
    }

    async update (
        issuedAtOld: number, 
        deviceId: string,
        issuedAtNew: number, 
        expiredAtNew: Date, 
        userId: string
    ): Promise <boolean> {
        const updateSessionResult = await AuthSessionsModel.updateOne(
            { deviceId: deviceId, userId: userId, lastActiveDate: issuedAtOld },
            { $set: { lastActiveDate: issuedAtNew, expirationDate: expiredAtNew }}
        )

        return updateSessionResult.matchedCount > 0
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
        const session = await AuthSessionsModel.findOne({lastActiveDate: issuedAt, deviceId: deviceId, userId: userId})

        return session
    }

    async findByDeviceId(
        deviceId: string
    ): Promise<AuthSessionsDocument | null> {
        const session = await AuthSessionsModel.findOne({deviceId: deviceId})

        return session
    }
}