import mongoose, { model } from "mongoose"


export type ApiRequestLogType = {
    ip: string
    url: string
    date: Date
}

type ApiRequestLogModel = mongoose.Model<ApiRequestLogType>
export type ApiRequestLogDocument = mongoose.HydratedDocument<ApiRequestLogType>

const ApiRequestLogSchema = new mongoose.Schema<ApiRequestLogType>({
    ip: { type: String, required: true, max: 50 },
    url: { type: String, required: true },
    date: { type: Date, required: true }
})

ApiRequestLogSchema.index({ date: 1 }, { expireAfterSeconds: 20 })
ApiRequestLogSchema.index({ ip: 1, url: 1, date: 1 })

export const ApiRequestLogModel = model<ApiRequestLogType, ApiRequestLogModel>('api_requests', ApiRequestLogSchema)