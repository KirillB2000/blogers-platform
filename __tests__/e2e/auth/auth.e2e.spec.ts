import { AUTH_PATH, AUTH_ROUTING } from "../../../src/auth/constants/auth.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import setupApp from "../../../src/setup-app";
import { clearDb } from "../../utils/clearDb";
import express from 'express'
import request from "supertest";
import { createUserDto } from "../../utils/users/createUserDto";
import { authDto } from "../../utils/auth/authDto";
import { UserInputModel } from "../../../src/users/dto/userInputModel";
import { usersCollection } from "../../../src/db/collections";
import { generateTestJwt } from "../../utils/generateJwt";

describe("Auth API body validation check", () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await usersCollection.deleteMany({})
    });

    afterAll(async () => {
        await clearDb(app);
        await stopDb()
    })

    it('Should log in with correct input data and existing user; POST /auth/login', async () => {
        const userRegestrationInput: UserInputModel = {
            login: 'Kirill',
            email: 'kirill@example.com',
            password: 'coolPassword'
        }
        const exisedUser = await createUserDto(app, userRegestrationInput)
        const userLoginInput = authDto(exisedUser.email, userRegestrationInput.password)

        const response = await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
            .send(userLoginInput)
            .expect(httpStatuses.Ok)

        expect(response.body).toEqual({
            accessToken: expect.any(String)
        })
    })

    it('Should successfully return current user data; GET /auth/me', async () => {
        const existedUser = await createUserDto(app)
        const token = generateTestJwt(existedUser)

        const response = await request(app)
            .get(`${AUTH_PATH}${AUTH_ROUTING.ME}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatuses.Ok)

        expect(response.body).toEqual({
            email: existedUser.email,
            login: existedUser.login,
            userId: existedUser.id
        })
    })
})