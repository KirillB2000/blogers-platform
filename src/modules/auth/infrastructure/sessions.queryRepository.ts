import { sessionsCollection } from "../../../db/collections";

export const sessionsQueryReposiroty = {
    async getAcviveSessionDevicesList (
        userId: string
    ) {
        const sessionsList = await sessionsCollection
            .find({ 
                userId: userId,
                expirationDate: { $gt: new Date() }
            })
            .toArray()

        return sessionsList
    }
}