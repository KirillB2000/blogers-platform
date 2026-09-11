import { requestsLogCollection } from "../../../../db/collections"

export const rateLimitRepository = {
    async create(
        ipAddress: string,
        url: string,
        date: Date
    ): Promise<void> {
        await requestsLogCollection.insertOne({
            ip: ipAddress,
            url: url,
            date: date
        })
    },

    async getRequestsCountInTimeWindow(
        ipAddress: string,
        url: string,
        secondsWindow: number
    ): Promise<number> {
        const tenSecondsAge = new Date(Date.now() - secondsWindow * 1000)

        const count = await requestsLogCollection
            .countDocuments({
                ip: ipAddress,
                url: url,
                date: {$gte: tenSecondsAge}
            })

        return count
    }
}