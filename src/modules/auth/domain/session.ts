import { UUID } from "crypto"

export type AuthSession = {
    userId: string
    deviceId: UUID
    lastActiveDate: number // version of the refresh token
    title: string // deviceName (need to parsin http header "user-agent")
    ip: string
    expirationDate: number
}