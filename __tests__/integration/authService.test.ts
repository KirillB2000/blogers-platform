import { MongoMemoryServer } from "mongodb-memory-server"
import { authService } from "../../src/auth/domain/auth.services"
import { userDto } from "../utils/users/userDto"
import { Db, MongoClient } from "mongodb"
import { initCollections, usersCollection } from "../../src/db/collections"
import { UserInputModel } from "../../src/users/input/dto/userInputModel"
import { nodemailerService } from "../../src/auth/adapters/nodemailer.services"
import { BadRequestError, UnauthorizedError } from "../../src/core/exceptions/app-errors.exeption"
import { LoginInputModel } from "../../src/auth/input/dto/loginInputModel"
import { usersRepository } from "../../src/users/repository/user.repository"
import { add } from "date-fns"
import { sessionsRepository } from "../../src/auth/infrastructure/sessions.repository"


describe('Integration tests for AuthService', () => {

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
        jest.clearAllMocks()
    })

    const sendEmailMock = jest
        .spyOn(nodemailerService, 'sendEmail')
        .mockImplementation(async () => {
            return { messageId: 'mocked-id' } as any
        })

    describe('registerUser', () => {

        it('Nodemailer.sendEmail should be called', async () => {
            const userDto1: UserInputModel = {
                ...userDto(),
                login: 'TestLogin1',
                password: '123321',
                email: 'kirill.bykov.2000@mail.ru'
            }

            await authService.registerUser(userDto1)

            expect(sendEmailMock).toHaveBeenCalledTimes(1)

        })
        
        it('Should register and create user', async () => {
            const result = await authService.registerUser(userDto())
            expect(result).toBe(undefined)

            const userInDb = await usersCollection.findOne({email: userDto().email})
            expect(userInDb).not.toBeNull()
        })

        it('Should not create user because of dublicated email', async () => {
            const firstUser = userDto()
            await authService.registerUser(firstUser)
            
            const secondUser: UserInputModel = {
                ...userDto(),
                login: 'xxx',
                email: firstUser.email
            }

            await expect(authService.registerUser(secondUser))
                .rejects
                .toThrow(BadRequestError)
        })

        it('Should not create user because of dublicated login', async () => {
            const firstUser = userDto()
            await authService.registerUser(firstUser)

            const secondUser: UserInputModel = {
                ...userDto(),
                login: firstUser.login,
                email: 'xxx12122323@email.com'
            }

            await expect(authService.registerUser(secondUser))
                .rejects
                .toThrow(BadRequestError)
        })
    })

    describe('loginUser', () => {
        it('should login user and response with db user type', async () => {
            const userIntput = userDto()
            await authService.registerUser(userIntput)

            const loginUserCreds: LoginInputModel = {
                loginOrEmail: userIntput.email,
                password: userIntput.password
            }

            const logedInUser = await authService.loginUser(loginUserCreds)

            expect(logedInUser)
                .toEqual({
                    accessToken: expect.any(String),
                    refreshToken: expect.any(String)
                })
        })

        it('Should throw unauthorized error if user doesnt exist by user creds', async () => {
            const loginUserCreds: LoginInputModel = {
                loginOrEmail: 'NotExistedLogin',
                password: 'funnyPassword'
            }

            await expect(authService.loginUser(loginUserCreds))
                .rejects
                .toThrow(UnauthorizedError)
        })

        it('Should throw unauthorized error if user have incorrect password in creds', async () => {
            const userIntput = userDto()
            await authService.registerUser(userIntput)

            const loginUserWithIncorrectPassword: LoginInputModel = {
                loginOrEmail: userIntput.email,
                password: 'Incorrect_password'
            }

            await expect (authService.loginUser(loginUserWithIncorrectPassword))
                .rejects
                .toThrow(UnauthorizedError)
        })
    })

    describe('emailConfirmation', () => {
        it('should confirm email for user with correct data', async() => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const notConfirmedUser = await usersRepository.findByEmail(userInput.email)

            expect (notConfirmedUser?.emailConfirmation.isConfirmed).toBe(false)

            await authService.emailConfirmation(notConfirmedUser!)

            const confirmedUser = await usersRepository.findByEmail(userInput.email)

            expect(confirmedUser?.emailConfirmation.isConfirmed).toBe(true)
        })

        it ('should not confirm already confirmed user', async () => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const notConfirmedUser = await usersRepository.findByEmail(userInput.email)
            
            await authService.emailConfirmation(notConfirmedUser!)

            const confirmedUser = await usersRepository.findByEmail(userInput.email)

            await expect (authService.emailConfirmation(confirmedUser!))
                .rejects
                .toThrow(BadRequestError)
        })

        it ('should not confirm user with expired token', async() => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const notConfirmedUser = await usersRepository.findByEmail(userInput.email)
            notConfirmedUser!.emailConfirmation.expirationDate = add(new Date(), {'hours': -1})

            await expect(authService.emailConfirmation(notConfirmedUser!))
                .rejects
                .toThrow(BadRequestError)
        })
    })

    describe('emailResending', () => {

        it ('should resending email to user', async () => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const existedUser = await usersRepository.findByEmail(userInput.email)

            await authService.emailResending(existedUser!)

            const existedUserAfterResending = await usersRepository.findByEmail(userInput.email)

            expect(existedUserAfterResending!.emailConfirmation.confirmationCode).not.toBe(existedUser!.emailConfirmation.confirmationCode)
            expect(existedUserAfterResending!.emailConfirmation.expirationDate).not.toBe(existedUser!.emailConfirmation.expirationDate)

            expect(sendEmailMock).toHaveBeenCalledTimes(2)
        })

        it('should to resending email to user with already confirmed email', async() => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const existedUser = await usersRepository.findByEmail(userInput.email)
            
            await authService.emailConfirmation(existedUser!)

            const confirmedUser = await usersRepository.findByEmail(userInput.email)

            await expect(authService.emailResending(confirmedUser!))
                .rejects
                .toThrow(BadRequestError)

            expect(sendEmailMock).toHaveBeenCalledTimes(1) // Only from registration method 
        })
    
    })

    describe ('refreshToken', () => {
        it('should return newAccessToken and newRefreshToken', async() => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const userLoginCreds: LoginInputModel = {
                loginOrEmail: userInput.email,
                password: userInput.password
            }

            const { refreshToken, accessToken } = await authService.loginUser(userLoginCreds)

            const { newRefreshToken, newAccessToken } = await authService.refreshToken(refreshToken)

            const tokenInSessionCollection = await sessionsRepository.findByToken(refreshToken)

            expect(tokenInSessionCollection).not.toBe(null)
            expect(tokenInSessionCollection?.token).toBe(refreshToken)

            await expect(authService.refreshToken(refreshToken))
                .rejects
                .toThrow(UnauthorizedError)

            expect(refreshToken).not.toBe(newRefreshToken)
            expect(accessToken).not.toBe(newAccessToken)
        })
    }),

    describe('logout', () => {
        it('should logout user and enter refresh token to sessions collection', async () => {
            const userInput = userDto()
            await authService.registerUser(userInput)

            const userLoginCreds: LoginInputModel = {
                loginOrEmail: userInput.email,
                password: userInput.password
            }

            const { refreshToken } = await authService.loginUser(userLoginCreds)

            await authService.logout(refreshToken)

            const tokenInSessionCollection = await sessionsRepository.findByToken(refreshToken)

            expect(tokenInSessionCollection).not.toBe(null)
            expect(tokenInSessionCollection?.token).toBe(refreshToken)

            await expect(authService.logout(refreshToken))
            .rejects
            .toThrow(UnauthorizedError)

            await expect(authService.refreshToken(refreshToken))
            .rejects
            .toThrow(UnauthorizedError)
        })
    })
})