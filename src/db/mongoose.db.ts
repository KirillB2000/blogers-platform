import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { SETTINGS } from '../settings/config'
dotenv.config()

const dbName = SETTINGS.DB_NAME
const mongoURI = SETTINGS.MONGO_URL

export async function runDb() {
    try {
        await mongoose.connect(mongoURI, {dbName: dbName})
        console.log('✅ Connected to the database')
        await Promise.all(
            mongoose.modelNames().map(modelName => mongoose.model(modelName).ensureIndexes())
        )
        console.log('🚀 All indexes synchronized successfully');
    } catch (e) {
        await mongoose.disconnect()
        console.log(`❌ Database not connected: ${e}`)
    }
}

export const stopDb = async () => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error(`❌ No active client`)
    }

    await mongoose.disconnect()
}