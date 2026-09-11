import { requestsLogCollection, sessionsCollection, usersCollection } from "./collections"

export const initIndexes = async () => {
    await usersCollection.createIndex({login: 1}, {unique: true})
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await sessionsCollection.createIndex({ expirationDate: 1 }, {expireAfterSeconds: 0})
    await sessionsCollection.createIndex({ lastActiveDate: 1, deviceId: 1, userId: 1 })
    await requestsLogCollection.createIndex({date: 1}, {expireAfterSeconds: 20})
    await requestsLogCollection.createIndex({ip: 1, url: 1, date: 1})
}