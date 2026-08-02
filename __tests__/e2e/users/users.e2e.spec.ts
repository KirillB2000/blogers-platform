import express from 'express'
import setupApp from '../../../src/setup-app'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { SETTINGS } from '../../../src/settings/config'
import { createUserDto } from '../../utils/users/createUserDto'
import { usersCollection } from '../../../src/db/collections'
import request from 'supertest'
import { USERS_PATH, USERS_ROUTING } from '../../../src/users/constants/users.paths'
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken'
import { httpStatuses } from '../../../src/core/types/http-statuses'

describe('Users API', () => {
    const app = express()
    setupApp(app)

    const adminToken = generateBasicAuthToken()

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await usersCollection.deleteMany({})
    })

    afterAll(async () => {
        await stopDb()
    })

    it ('Should created new user; POST /users', async () => {
        const userDto = {
            login: 'TestLogin2',
            password: 'testPassword2',
            email: 'test@example2.com'
        }
        const user = await createUserDto(app, userDto)

        expect(user).toEqual({
            id: expect.stringMatching(/^[0-9a-fA-F]{24}$/),
            login: 'TestLogin2',
            password: expect.not.stringMatching('testPassword2'),
            email: 'test@example2.com',
            createdAt: expect.any(String)
        })
    }),

    it('Should delete user by id; DELETE /users/:id', async () => {
        const user = await createUserDto(app)
        const userId = user.id

        await request(app)
            .delete(`${USERS_PATH}/${userId}`)
            .set("Authorization", adminToken)
            .expect(httpStatuses.NoContent)
    })
})