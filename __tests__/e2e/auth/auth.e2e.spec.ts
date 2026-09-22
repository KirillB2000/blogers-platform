import { AUTH_PATH, AUTH_ROUTING } from "../../../src/modules/auth/constants/auth.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import setupApp from "../../../src/setup-app";
import { clearDb } from "../../utils/clearDb";
import express from 'express'
import request from "supertest";
import { createUserDto } from "../../utils/users/createUserDto";
import { authDto } from "../../utils/auth/authDto";
import { generateTestAccessJwt } from "../../utils/generateJwt";
import { UserInputModel } from "../../../src/modules/users/api/input/dto/userInputModel";
import { userDto } from "../../utils/users/userDto";
import { LoginInputModel } from "../../../src/modules/auth/api/input/dto/loginInputModel";
import { RegistrationEmailResendingInputModel } from "../../../src/modules/auth/api/input/dto/registrationEmailResendingInputModel";
import { runDb, stopDb } from "../../../src/db/mongoose.db";
import { UsersModel } from "../../../src/modules/users/infrastructure/users.model";
import { AuthSessionsModel } from "../../../src/modules/auth/infrastructure/sessions.model";
import { ApiRequestLogModel } from "../../../src/core/middlewares/rateLimiter/infrastructure/rateLimitModel";

describe("Auth API", () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDb()
        await UsersModel.deleteMany({})
    });

    afterAll(async () => {
        await clearDb(app);
        await stopDb()
    })

    beforeEach(async () => {
        await UsersModel.deleteMany({})
        await AuthSessionsModel.deleteMany({})
        await ApiRequestLogModel.deleteMany({})
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
        const token = generateTestAccessJwt(existedUser)

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

    it('Should return too many request error because of rate limiting middleware; POST /auth/login', async () => {
        const userInputModel = userDto()

        await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
            .send(userInputModel)
            .expect(httpStatuses.NoContent) 

        const userCreds: LoginInputModel = {
            loginOrEmail: userInputModel.email,
            password: userInputModel.password
        }   

        for (let i = 0; i < 5; i++) {
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                .set('user-agent', 'Chrome')
                .send(userCreds)   
        }

        await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
            .set('user-agent', 'Chrome')
            .send(userCreds) 
            .expect(httpStatuses.TooManyRequests)
    })

    it('Should return too many request error because of rate limiting middleware; POST /auth/registration-email-resending', async () => {
        const userInputModel = userDto()

        await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
            .send(userInputModel)
            .expect(httpStatuses.NoContent)

        const emailResendingInput: RegistrationEmailResendingInputModel = {
            email: userInputModel.email
        }

        for (let i = 0; i < 5; i++) {
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION_EMAIL_RESENDING}`)
                .send(emailResendingInput)
                .expect(httpStatuses.NoContent)
        }

        await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION_EMAIL_RESENDING}`)
            .send(emailResendingInput)
            .expect(httpStatuses.TooManyRequests)

        // After waiting outside the 10 seconds window the endpoint should be available again
        await new Promise(resolve => setTimeout(resolve, 11000))

        await request(app)
            .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION_EMAIL_RESENDING}`)
            .send(emailResendingInput)
            .expect(httpStatuses.NoContent)
    }, 30000)
})