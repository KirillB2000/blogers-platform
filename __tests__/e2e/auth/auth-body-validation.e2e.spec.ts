import { AUTH_PATH, AUTH_ROUTING } from "../../../src/modules/auth/constants/auth.paths";
import { LoginInputModel } from "../../../src/modules/auth/api/input/dto/loginInputModel";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { usersCollection } from "../../../src/db/collections";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import setupApp from "../../../src/setup-app";
import { clearDb } from "../../utils/clearDb";
import express from 'express'
import request from "supertest";

describe("Auth API body validation check", () => {
    const app = express();
    setupApp(app);

    const correctAuthDto: LoginInputModel = {
        loginOrEmail: 'someLoginOrEmail',
        password: 'somePassord'
    }

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await usersCollection.deleteMany({})
    });
    
    afterAll(async () => {
        await clearDb(app);
        await stopDb()
    })

    it('Should not log in user with incorrect data', async () => {
        const incorrectInputData: LoginInputModel = {
            ...correctAuthDto,
            loginOrEmail: '',
            password: ''
        }

        const response = await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
            .send(incorrectInputData)
            .expect(httpStatuses.BadRequest)

        expect(response.body.errorsMessages).toHaveLength(2)
    })
})