import { ObjectId, WithId } from "mongodb";
import { User } from "../../users/domain/user";
import { LoginSuccessViewModel } from "../output/accessToken-output.type";
import jwt from 'jsonwebtoken'
import { SETTINGS } from "../../settings/config";

export const jwtService = {
    async createJWT (
        user: WithId<User>
    ): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userId: user._id.toString()}, SETTINGS.JWT_SECRET, {expiresIn: '10m'})

        return {accessToken: token}
    },

    async getUserIdByToken(token: string): Promise<{userId: string} | null> {

        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as {userId: string}
        } catch(error) {
            console.error("Token verify some error");
            return null
        }
    }
}