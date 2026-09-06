import { UUID } from "crypto"

export type AuthSession = {
    userId: string
    deviceId: UUID
    issuedAt: number // version of the refresh token
    deviceName: string
    ip: string
    expirationDate: number
}