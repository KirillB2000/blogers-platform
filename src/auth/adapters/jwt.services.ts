import { WithId } from "mongodb";
import { LoginSuccessViewModel } from "../output/accessToken-output.type";
import jwt from 'jsonwebtoken'
import { SETTINGS } from "../../settings/config";
import { IUserDB } from "../../users/input/domain/iUserDb";

const JWT_SECRET = SETTINGS.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error("❌ Critical: JWT_SECRET is missing in environment variables!")
}

export const jwtService = {
    async createJWT (
        user: WithId<IUserDB>
    ): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {expiresIn: '10m'})

        return {accessToken: token}
    },

    async getUserIdByToken(token: string): Promise<{userId: string} | null> {

        try {
            return jwt.verify(token, JWT_SECRET) as {userId: string}
        } catch(error) {
            console.error("Token verify some error");
            return null
        }
    }
}