import { injectable } from "inversify";
import { AuthSessionsModel } from "./sessions.model";

@injectable()
export class SessionsQwReposiroty {
    async getAcviveSessionDevicesList (
        userId: string
    ) {
        const sessionsList = await AuthSessionsModel
            .find({ 
                userId: userId,
                expirationDate: { $gt: new Date() }
            })

        return sessionsList
    }
}