import mongoose, { model } from "mongoose"


export type AuthSessionsType = {
    userId: string
    deviceId: string
    lastActiveDate: number // version of the refresh token
    title: string // deviceName (need to parsin http header "user-agent")
    ip: string
    expirationDate: Date
}

type AuthSessionsModel = mongoose.Model<AuthSessionsType>
export type AuthSessionsDocument = mongoose.HydratedDocument<AuthSessionsType>

const AuthSessionsSchema = new mongoose.Schema<AuthSessionsType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    lastActiveDate: { type: Number, required: true },
    title: { type: String, required: true, max: 100 },
    ip: { type: String, required: true, max: 100 },
    expirationDate: { type: Date, required: true }
})

AuthSessionsSchema.index({ expirationDate: 1 }, { expireAfterSeconds: 0 })
AuthSessionsSchema.index({ deviceId: 1, userId: 1, lastActiveDate: 1 })

export const AuthSessionsModel = model<AuthSessionsType, AuthSessionsModel>('sessions', AuthSessionsSchema)