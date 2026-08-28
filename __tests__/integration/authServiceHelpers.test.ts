import { MongoClient, Db } from "mongodb"
import { MongoMemoryServer } from "mongodb-memory-server"
import { initCollections, sessionsCollection, usersCollection } from "../../src/db/collections"
import { authService } from "../../src/auth/domain/auth.services"
import { authServiceHelpers } from "../../src/auth/domain/auth.serviceHelpers"
import { testRegisterAndLoginUser } from "./utils/testRegisterAndLoginUser"
import { UnauthorizedError } from "../../src/core/exceptions/app-errors.exeption"
import { usersRepository } from "../../src/users/repository/user.repository"
import jwt from 'jsonwebtoken'
import { SETTINGS } from "../../src/settings/config"

describe('Integration tests for AuthServiceHelpers', () => {

    const JWT_REFRESH_SECRET = SETTINGS.JWT_REFRESH_SECRET
    if (!JWT_REFRESH_SECRET) {
        throw new Error("❌ Critical: JWT_REFRESH_SECRET is missing in environment variables!")
    }

    let mongoServer: MongoMemoryServer
    let client: MongoClient
    let db: Db
    
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create()
        const mongoUri = mongoServer.getUri()

        client = new MongoClient(mongoUri)
        await client.connect()
        db = client.db('test-database')
        initCollections(db)
    })

    afterAll(async () => {
        if(client) await client.close()
        if(mongoServer) await mongoServer.stop()
    })

    afterEach(async () => {
        await usersCollection.deleteMany({})
        await sessionsCollection.deleteMany({})
        jest.clearAllMocks()
    })

    describe('refreshTokenValidation', () => {
        it('Should return userId, expirationDate and userById', async () => {
            const { refreshToken } = await testRegisterAndLoginUser()

            const rtValidationResult = await authServiceHelpers.refreshTokenValidation(refreshToken)

            expect(rtValidationResult).toEqual({
                userId: expect.any(String),
                expirationDate: expect.any(Date),
                userById: expect.any(Object)
            })
        })

        it('Should not validate refresh token because of token already in black list', async () => {
            const { refreshToken } = await testRegisterAndLoginUser()

            await authService.logout(refreshToken)

            await expect(authServiceHelpers.refreshTokenValidation(refreshToken))
                .rejects
                .toThrow(UnauthorizedError)
        })

        it('Should not validate refresh token because of incorrect token', async () => {
            const refreshToken = 'Some token with incorrect info'

            await expect(authServiceHelpers.refreshTokenValidation(refreshToken))
                .rejects
                .toThrow(UnauthorizedError)
        })

        it('Should not validate refresh token because user by id is not exiting', async () => {
            const { refreshToken, userEmail } = await testRegisterAndLoginUser()

            const user = await usersRepository.findByEmail(userEmail)
            const userId = user!._id.toString()

            await usersRepository.delete(userId)

            await expect(authServiceHelpers.refreshTokenValidation(refreshToken))
                .rejects
                .toThrow(UnauthorizedError)
        })

        it('Should not validate refresh token because token is expired', async () => {
        
            
            const { userEmail } = await testRegisterAndLoginUser()
            const user = await usersRepository.findByEmail(userEmail)

            const payload = {
                userId: user!._id.toString(),
                jti: 'some uuid'
            }

            const expiredInSeconds = Math.floor(Date.now() / 1000) - 40

            const expiredRefreshToken = jwt.sign({ ...payload, exp: expiredInSeconds }, JWT_REFRESH_SECRET)

            await expect(authServiceHelpers.refreshTokenValidation(expiredRefreshToken))
                .rejects
                .toThrow(UnauthorizedError)
        })
    })
})