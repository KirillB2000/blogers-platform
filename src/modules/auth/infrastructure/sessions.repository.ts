import { UUID } from "crypto"
import { sessionsCollection } from "../../../db/collections"
import { AuthSession } from "../domain/session"

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
        expiredAtNew: number, 
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

    async findSession (
        issuedAt: number,
        deviceId: UUID,
        userId: string
    ) {
        const session = await sessionsCollection.findOne({lastActiveDate: issuedAt, deviceId: deviceId, userId: userId})

        return session
    }
}