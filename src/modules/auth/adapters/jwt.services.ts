import { WithId } from "mongodb";
import jwt, { JwtPayload} from 'jsonwebtoken'
import { SETTINGS } from "../../../settings/config";
import { randomUUID, UUID } from "crypto";
import { IUserDB } from "../../users/domain/iUserDb";
import { JwtPayloadSessions } from "../api/input/jwtPayloadSessions";

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
        const payload = { 
            userId: user._id.toString(),
            jti: randomUUID()
        }

        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '10s'})

        return accessToken
    },

    async createRefreshJWT (
        user: WithId<IUserDB>,
        deviceId: UUID
    ): Promise<{ refreshToken: string, issuedAt: number, expiredAt: number}> {
        const payload: JwtPayload = {
            userId: user._id.toString(),
            deviceId: deviceId,
            jti: randomUUID(),
        }
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '20s'})

        const { iat, exp } = jwt.decode(refreshToken) as JwtPayloadSessions

        const cretedRefreshJwtInfo = {
            refreshToken: refreshToken,
            issuedAt: iat * 1000, 
            expiredAt: exp * 1000
        }

        return cretedRefreshJwtInfo
    },

    async getUserIdByAccessToken(token: string): Promise<{userId: string} | null> {

        try {
            return jwt.verify(token, JWT_ACCESS_SECRET) as {userId: string}
        } catch(error) {
            return null
        }
    },

    async getUserIdByRefreshToken(token: string): Promise<JwtPayloadSessions | null> {

        try {
            const payload = jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayloadSessions | null

            if (payload) {
                payload.iat = payload.iat * 1000
                payload.exp = payload.exp * 1000
            }

            return payload
        } catch (error) {
            return null
        }
    },
}