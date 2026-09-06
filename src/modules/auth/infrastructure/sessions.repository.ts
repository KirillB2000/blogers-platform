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

    async findByToken (
        token: string
    ) {
        const tokenInfo = await sessionsCollection.findOne({token: token})

        return tokenInfo
    }
}