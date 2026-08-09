import express from 'express'
import setupApp from '../../../src/setup-app'
import { runDB, stopDb } from '../../../src/db/mongo.db'
import { SETTINGS } from '../../../src/settings/config'
import { createUserDto } from '../../utils/users/createUserDto'
import { usersCollection } from '../../../src/db/collections'
import request from 'supertest'
import { USERS_PATH } from '../../../src/users/constants/users.paths'
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken'
import { httpStatuses } from '../../../src/core/types/http-statuses'

describe('Users API', () => {
    const app = express()
    setupApp(app)

    const adminToken = generateBasicAuthToken()

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
    })

    beforeEach(async () => {
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

    it('Should get paginated list of users; GET /users', async () => {
        const user = await createUserDto(app)
        const user2 = await createUserDto(app, {
            login: 'SecndUser2',
            password: '12332111',
            email: 'secondUser@example.com'
        })

        const paginatedUsers = await request(app)
            .get(USERS_PATH)
            .set("Authorization", adminToken)
            .expect(httpStatuses.Ok)
        
        expect(paginatedUsers.body.items).toHaveLength(2)
        expect(paginatedUsers.body.items[0]).toEqual({...user2})
        expect(paginatedUsers.body.items[1]).toEqual({ ...user})
    })

    it('Should get paginated list of users for firts page with page size 2; GET /users', async () => {
        const user = await createUserDto(app)
        const user2 = await createUserDto(app, {
            login: 'SecndUser2',
            password: '12332111',
            email: 'secondUser@example.com'
        })
        const user3 = await createUserDto(app, {
            login: 'SecndUser3',
            password: '12332111',
            email: 'thirdUser@example.com'
        })

        const paginatedUsers = await request(app)
            .get(`${USERS_PATH}?pageNumber=1&pageSize=2`)
            .set("Authorization", adminToken)
            .expect(httpStatuses.Ok)

        expect(paginatedUsers.body.items).toHaveLength(2)
        expect(paginatedUsers.body.items[0]).toEqual({ ...user3})
        expect(paginatedUsers.body.items[1]).toEqual({ ...user2})
    })
})