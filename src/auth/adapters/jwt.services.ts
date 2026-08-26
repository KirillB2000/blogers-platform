import { WithId } from "mongodb";
import jwt, { JwtPayload} from 'jsonwebtoken'
import { SETTINGS } from "../../settings/config";
import { IUserDB } from "../../users/input/domain/iUserDb";

const JWT_ACCESS_SECRET = SETTINGS.JWT_ACCESS_SECRET
if (!JWT_ACCESS_SECRET) {
    throw new Error("❌ Critical: JWT_ACCESS_SECRET is missing in environment variables!")
}

const JWT_REFRESH_SECRET = SETTINGS.JWT_REFRESH_SECRET
if (!JWT_REFRESH_SECRET) {
    throw new Error("❌ Critical: JWT_REFRESH_SECRET is missing in environment variables!")
}


export const jwtService = {
    async createAccessJWT (
        user: WithId<IUserDB>
    ): Promise<string> {
        const accessToken = jwt.sign({ userId: user._id.toString() }, JWT_ACCESS_SECRET, {expiresIn: '10s'})

        return accessToken
    },

    async createRefreshJWT (
        user: WithId<IUserDB>
    ): Promise<string> {
        const refreshToken = jwt.sign({userId: user._id.toString()}, JWT_REFRESH_SECRET, {expiresIn: '20s'})

        return refreshToken
    },

    async getUserIdByAccessToken(token: string): Promise<{userId: string} | null> {

        try {
            return jwt.verify(token, JWT_ACCESS_SECRET) as {userId: string}
        } catch(error) {
            console.error("Token verify some error");
            return null
        }
    },

    async getUserIdByRefreshToken(token: string): Promise<string | null> {

        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as string
        } catch (error) {
            console.error("Token verify some error");
            return null
        }
    },

    async getExpirationDateByRefreshToken(token: string): Promise<Date | null> {
        const decodedRefreshToken = jwt.decode(token) as JwtPayload | null

        if (!decodedRefreshToken || !decodedRefreshToken.exp) {
            return null
        }

        const expirationDate = new Date(decodedRefreshToken.exp * 1000)

        return expirationDate
    }
}