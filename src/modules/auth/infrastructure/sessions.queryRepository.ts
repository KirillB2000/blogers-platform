import { injectable } from "inversify";
import { sessionsCollection } from "../../../db/collections";

@injectable()
export class SessionsQwReposiroty {
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