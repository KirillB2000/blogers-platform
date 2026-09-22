import express from 'express'
import setupApp from '../../../src/setup-app';
import request from 'supertest'
import { USERS_PATH } from '../../../src/modules/users/constants/users.paths';
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generateBasicAuthToken';
import { UserInputModel } from '../../../src/modules/users/api/input/dto/userInputModel';
import { runDb, stopDb } from '../../../src/db/mongoose.db';
import { UsersModel } from '../../../src/modules/users/infrastructure/users.model';

describe("Blogs API body validation check", () => {
    const app = express();
    setupApp(app);

    const correctUserInputData: UserInputModel = {
        login: 'CorrectLogin',
        password: 'correctPassw',
        email: 'correctEmail@example.com'
    };

    beforeAll(async () => {
        await runDb()
        await UsersModel.deleteMany({})
    });

    afterAll(async () => {
        await UsersModel.deleteMany({})
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