import { ApiRequestLogModel } from "./rateLimitModel"

export const rateLimitRepository = {
    async create(
        ipAddress: string,
        url: string,
        date: Date
    ): Promise<void> {
        await ApiRequestLogModel.insertOne(
            { ip: ipAddress, url: url, date: date},
        )
    },

    async getRequestsCountInTimeWindow(
        ipAddress: string,
        url: string,
        secondsWindow: number
    ): Promise<number> {

        const tenSecondsAgo = new Date(Date.now() - secondsWindow * 1000)

        const count = await ApiRequestLogModel
            .countDocuments(
                { ip: ipAddress, url: url, date: { $gte: tenSecondsAgo }},
            )

        return count
    }
}