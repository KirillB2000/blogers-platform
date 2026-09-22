
export type RefreshTokenPayload = {
    userId: string,
    deviceId: string,
    jti: string,
    iat: number,
    exp: number
}