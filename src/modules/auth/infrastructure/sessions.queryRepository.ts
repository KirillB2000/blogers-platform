import { UUID } from "crypto";
import { sessionsCollection } from "../../../db/collections";

export const sessionsQueryReposiroty = {
    async getAcviveSessionDevicesList (
        lastActiveDate: number,
        deviceId: UUID,
        userId: string
    ) {
        const sessionsList = await sessionsCollection
            .find({lastActiveDate: lastActiveDate, deviceId: deviceId, userId: userId})
            .toArray()

        return sessionsList
    }
}