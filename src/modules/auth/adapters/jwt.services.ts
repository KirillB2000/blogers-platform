import { WithId } from "mongodb";
import jwt from 'jsonwebtoken'
import { SETTINGS } from "../../../settings/config";
import { randomUUID, UUID } from "crypto";
import { IUserDB } from "../../users/domain/iUserDb";
import { RefreshTokenPayload } from "../api/input/jwtPayloadSessions";
import { injectable } from "inversify";


@injectable()
export class JwtService {

    private readonly accessSecret: string;
    private readonly refreshSecret: string

    constructor() {
        const access = SETTINGS.JWT_ACCESS_SECRET
        const refresh = SETTINGS.JWT_REFRESH_SECRET

        if (!access) {
            throw new Error("❌ Critical: JWT_ACCESS_SECRET is missing in environment variables!")
        }

        if (!refresh) {
            throw new Error("❌ Critical: JWT_REFRESH_SECRET is missing in environment variables!")
        }

        this.accessSecret = access
        this.refreshSecret = refresh
    }
    
    async createAccessJWT (
        user: WithId<IUserDB>
    ): Promise<string> {
        const payload = { 
            userId: user._id.toString(),
            jti: randomUUID()
        }

        const accessToken = jwt.sign(payload, this.accessSecret, {expiresIn: '10s'})

        return accessToken
    }

    async createRefreshJWT (
        user: WithId<IUserDB>,
        deviceId: UUID
    ): Promise<{ refreshToken: string, issuedAt: number, expiredAt: Date}> {
        const iatSeconds = Math.floor(Date.now() / 1000)
        const expSeconds = iatSeconds + 20

        const payload: RefreshTokenPayload = {
            userId: user._id.toString(),
            deviceId: deviceId,
            jti: randomUUID(),
            iat: iatSeconds,
            exp: expSeconds
        }
        
        const refreshToken = jwt.sign(payload, this.refreshSecret)

        return {
            expiredAt: new Date(expSeconds * 1000),
            issuedAt: iatSeconds * 1000,
            refreshToken: refreshToken
        }
    }

    async getUserIdByAccessToken(token: string): Promise<{userId: string} | null> {

        try {
            return jwt.verify(token, this.accessSecret) as {userId: string}
        } catch(error) {
            return null
        }
    }

    async getUserIdByRefreshToken(token: string): Promise<RefreshTokenPayload | null> {

        try {
            const payload = jwt.verify(token, this.refreshSecret) as RefreshTokenPayload | null
            return payload
        } catch (error) {
            return null
        }
    }
}