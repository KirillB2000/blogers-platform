import { UUID } from "crypto";
import { JwtPayload } from "jsonwebtoken";

export type JwtPayloadSessions = JwtPayload & {
    userId: string,
    deviceId: UUID,
    iat: number,
    exp: number
}