import express from 'express'
import setupApp from '../../../src/setup-app';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { usersCollection } from '../../../src/db/collections';
import { SETTINGS } from '../../../src/settings/config';
import request from 'supertest'
import { USERS_PATH } from '../../../src/modules/users/constants/users.paths';
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken';
import { UserInputModel } from '../../../src/modules/users/api/input/dto/userInputModel';

describe("Blogs API body validation check", () => {
    const app = express();
    setupApp(app);

    const correctUserInputData: UserInputModel = {
        login: 'CorrectLogin',
        password: 'correctPassw',
        email: 'correctEmail@example.com'
    };

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await usersCollection.deleteMany({})
    });

    afterAll(async () => {
        await usersCollection.deleteMany({})
        await stopDb()
    })

    it("Should not create user without authorization", async () => {
        await request(app)
            .post(USERS_PATH)
            .send({...correctUserInputData})
            .expect(httpStatuses.Unauthorized)
    }),

    it("Should not create user with incorrect input data", async () => {
        const incorrectInputData = {
            login: 'IncorrectLoginnnnnnnnnnnnnnnnnnnn',
            password: '12',
            email: '@incorrectEmail'
        }
        const response = await request(app)
            .post(USERS_PATH)
            .set("Authorization", generateBasicAuthToken())
            .send({ ...incorrectInputData })
            .expect(httpStatuses.BadRequest)

        expect(response.body.errorsMessages).toHaveLength(3)
    })
})