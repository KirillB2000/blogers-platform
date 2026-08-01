import { usersCollection } from "./collections"

export const initIndexes = async () => {
    await usersCollection.createIndex({login: 1}, {unique: true})
    await usersCollection.createIndex({ email: 1 }, { unique: true })
}