import { UUID } from "crypto";

export type RefreshTokenPayload = {
    userId: string,
    deviceId: UUID,
    jti: string,
    iat: number,
    exp: number
}