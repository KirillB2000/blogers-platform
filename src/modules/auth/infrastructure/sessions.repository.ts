import { sessionsCollection } from "../../../db/collections"

export const sessionsRepository = {
    async create (
        tokenInfo: RefreshTokenDb
    ): Promise<String> {
        const blackListedTokenId = await sessionsCollection.insertOne(tokenInfo)

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