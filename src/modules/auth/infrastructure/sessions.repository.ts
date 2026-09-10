import { UUID } from "crypto"
import { sessionsCollection } from "../../../db/collections"
import { AuthSession } from "../domain/session"
import { WithId } from "mongodb"

export const sessionsRepository = {
    async create (
        sessionInfo: AuthSession
    ): Promise<String> {
        const blackListedTokenId = await sessionsCollection.insertOne(sessionInfo)

        const tokenInfoId = blackListedTokenId.insertedId.toString()

        return tokenInfoId
    },

    async update (
        issuedAtOld: number, 
        deviceId: UUID,
        issuedAtNew: number, 
        expiredAtNew: Date, 
        userId: string
    ): Promise <boolean> {
        const updateSessionResult = await sessionsCollection.updateOne(
            { lastActiveDate: issuedAtOld, deviceId: deviceId, userId: userId },
            { $set: { lastActiveDate: issuedAtNew, expirationDate: expiredAtNew }}
        )

        return updateSessionResult.matchedCount > 0
    },

    async delete(
        issuedAt: number,
        deviceId: UUID,
        userId: string
    ): Promise<boolean> {
        const deleteSessionResult = await sessionsCollection.deleteOne(
            { lastActiveDate: issuedAt, deviceId: deviceId, userId: userId }
        )

        return deleteSessionResult.deletedCount > 0
    },

    async deleteOne(
        deviceId: UUID
    ): Promise<void> {
        await sessionsCollection.deleteOne({deviceId: deviceId})
    },

    async deleteOtherSessions(
        deviceId: UUID, 
        userId: string
    ): Promise<void> {
        await sessionsCollection.deleteMany({ 
            userId: userId, 
            deviceId: {$ne: deviceId} 
        })
    },

    async findSession (
        issuedAt: number,
        deviceId: UUID,
        userId: string
    ): Promise<WithId<AuthSession> | null> {
        const session = await sessionsCollection.findOne({lastActiveDate: issuedAt, deviceId: deviceId, userId: userId})

        return session
    },

    async findByDeviceId(
        deviceId: UUID
    ): Promise<WithId<AuthSession> | null> {
        const session = await sessionsCollection.findOne({deviceId: deviceId})

        return session
    }
}