jest.mock('nodemailer', () => {
    return {
        createTransport: jest.fn().mockReturnValue({
            sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id-12345' })
        })
    };
});

import request from "supertest";
import express from 'express'
import setupApp from "../../../src/setup-app";
import { requestsLogCollection, sessionsCollection, usersCollection } from "../../../src/db/collections";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import { clearDb } from "../../utils/clearDb";
import { userDto } from "../../utils/users/userDto";
import { createUserDto } from "../../utils/users/createUserDto";
import { AUTH_PATH, AUTH_ROUTING } from "../../../src/modules/auth/constants/auth.paths";
import { LoginInputModel } from "../../../src/modules/auth/api/input/dto/loginInputModel";
import { SECURITY_DEVICES_PATH } from "../../../src/modules/securityDevices/constants/securityDevices.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { randomUUID } from "crypto";

describe('securityDevice API', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL)
        await sessionsCollection.deleteMany({})
    });
    
    afterAll(async () => {
        await clearDb(app);
        await stopDb()
    })

    beforeEach(async () => {
        await usersCollection.deleteMany({})
        await sessionsCollection.deleteMany({})
        await requestsLogCollection.deleteMany({})
    })

    describe('DELETE /security/devices/{deviceId}', () => {

        it('Should delete one session from sessions collection', async () => {
            const userInputModel = userDto()    
            await createUserDto(app, userInputModel)    
            const userCreds: LoginInputModel = {
                loginOrEmail: userInputModel.email,
                password: userInputModel.password
            }   
            const loginRes = await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                .set('user-agent', 'Chrome')
                .send(userCreds)    
            const cookie = loginRes.headers['set-cookie']   
            const session = await sessionsCollection.findOne({})
            const diviceId = session!.deviceId  
            await request(app)
                .delete(`${SECURITY_DEVICES_PATH}/${diviceId}`)
                .set('Cookie', cookie)
                .expect(httpStatuses.NoContent) 
            const deletedSession = await sessionsCollection.findOne({})
            expect(deletedSession).toBeNull()
        }),

        it('should throw the forbidden error when trying to delete the deviceid of other user', async () => {
            const userInputModel1 = userDto()
            const userInputModel2 = {
                ...userDto(),
                email: 'secondUser2@exapmple.com',
                password: '123123123123',
                login: 'LogUs2'
            }   
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                .send(userInputModel1)
                .expect(httpStatuses.NoContent) 
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                .send(userInputModel2)
                .expect(httpStatuses.NoContent) 
            const userCreds1: LoginInputModel = {
                loginOrEmail: userInputModel1.email,
                password: userInputModel1.password
            }   
            const userCreds2: LoginInputModel = {
                loginOrEmail: userInputModel2.email,
                password: userInputModel2.password
            }   
            const loginRes1 = await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                .set('user-agent', 'Chrome')
                .send(userCreds1)   
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                .set('user-agent', 'Mozilla')
                .send(userCreds2)   
            const cookieUser1 = loginRes1.headers['set-cookie'] 
            const [, sessionUser2] = await sessionsCollection.find({}).toArray() // Save user2 second, second in array  
            const deviceIdUser2 = sessionUser2.deviceId 
            await request(app)
                .delete(`${SECURITY_DEVICES_PATH}/${deviceIdUser2}`)
                .set('Cookie', cookieUser1)
                .expect(httpStatuses.Forbidden) 
        }),

        it('should throw not found error if none of users in collection by diviceId', async () => {
            const userInputModel1 = userDto()   
            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                .send(userInputModel1)
                .expect(httpStatuses.NoContent) 
            const userCreds: LoginInputModel = {
                loginOrEmail: userInputModel1.email,
                password: userInputModel1.password
            }   
            const loginRes = await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                .set('user-agent', 'Chrome')
                .send(userCreds)    
            const divceIdWithNoSession = randomUUID()   
            const cookie = loginRes.headers['set-cookie']   
            await request(app)
                .delete(`${SECURITY_DEVICES_PATH}/${divceIdWithNoSession}`)
                .set('Cookie', cookie)
                .expect(httpStatuses.NotFound)
        })
    }),

    describe('DELETE /security/devices', () => {
        it ('should delete all sessions exlude current', async () => {
            const userInputModel = userDto()

            await request(app)
                .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                .send(userInputModel)
                .expect(httpStatuses.NoContent)

            const userCreds: LoginInputModel = {
                loginOrEmail: userInputModel.email,
                password: userInputModel.password
            } 

            let cookie
            for (let i = 1; i <= 4; i++) {
                const loginRes = await request(app)
                        .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                        .set('user-agent', `Chrome${i}`)
                        .send(userCreds)    
                if (i == 1) {
                    cookie = loginRes.headers['set-cookie'] 
                }
            }

            const totalCountCollectionBeforDeleteAllSession = await sessionsCollection.countDocuments({})

            expect(totalCountCollectionBeforDeleteAllSession).toBe(4)

            await request(app)
                .delete(`${SECURITY_DEVICES_PATH}`)
                .set('Cookie', cookie!)
                .expect(httpStatuses.NoContent)

            const totalCountCollectionAfterDeleteAllSession = await sessionsCollection.countDocuments({})

            expect(totalCountCollectionAfterDeleteAllSession).toBe(1)
        })
    }),

        describe('GET /security/devices', () => {
            it ('should return all device with active sessions for current user', async () => {
                const userInputModel = userDto()

                await request(app)
                    .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                    .send(userInputModel)
                    .expect(httpStatuses.NoContent)

                const userInputModel2 = {
                    ...userDto(),
                    email: 'secondUser2@exapmple.com',
                    password: '123123123123',
                    login: 'LogUs2'
                }   

                await request(app)
                    .post(`${AUTH_PATH}${AUTH_ROUTING.REGISTRATION}`)
                    .send(userInputModel2)
                    .expect(httpStatuses.NoContent)

                const userCreds: LoginInputModel = {
                    loginOrEmail: userInputModel.email,
                    password: userInputModel.password
                }

                const userCreds2: LoginInputModel = {
                    loginOrEmail: userInputModel2.email,
                    password: userInputModel2.password
                }

                await request(app) // another user to check the returned sessions count
                    .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                    .set('user-agent', `Mozilla`)
                    .send(userCreds2)

                let cookie
                for (let i = 1; i <= 4; i++) { // 4 session 1 user
                    const loginRes = await request(app)
                        .post(`${AUTH_PATH}${AUTH_ROUTING.LOGIN}`)
                        .set('user-agent', `Chrome${i}`)
                        .send(userCreds)
                    if (i == 1) {
                        cookie = loginRes.headers['set-cookie']
                    }
                }

                // 5 sessions at all, 1 for user2

                const resSessions = await request(app)
                    .get(`${SECURITY_DEVICES_PATH}`)
                    .set('Cookie', cookie!)
                    .expect(httpStatuses.Ok)

                expect(resSessions.body.length).toBe(4)
            })
        })
})