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
        expiredAtNew: number
    ): Promise <boolean> {
        const updateSessionResult = await sessionsCollection.updateOne(
            { lastActiveDate: issuedAtOld, deviceId: deviceId},
            { $set: { lastActiveDate: issuedAtNew, expirationDate: expiredAtNew }}
        )

        return updateSessionResult.matchedCount > 0
    },

    async findByToken (
        token: string
    ) {
        const tokenInfo = await sessionsCollection.findOne({token: token})

        return tokenInfo
    }
}