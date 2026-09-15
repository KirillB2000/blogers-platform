import { sessionsCollection } from "../../../db/collections";

export class SessionsQueryReposiroty {
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