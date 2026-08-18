import { MongoMemoryServer } from "mongodb-memory-server"
import { authService } from "../../src/auth/domain/auth.services"
import { userDto } from "../utils/users/userDto"
import { Db, MongoClient, ObjectId } from "mongodb"
import { initCollections, usersCollection } from "../../src/db/collections"
import { UserInputModel } from "../../src/users/input/dto/userInputModel"
import { nodemailerService } from "../../src/auth/adapters/nodemailer.services"
import { BadRequestError, UnauthorizedError } from "../../src/core/exceptions/app-errors.exeption"
import { LoginInputModel } from "../../src/auth/input/dto/loginInputModel"


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

            expect(logedInUser.password).not.toBe(userIntput.password)

            expect(logedInUser)
                .toEqual({
                    _id: expect.any(ObjectId),
                    login: userIntput.login,
                    email: userIntput.email,
                    password: expect.any(String),
                    createdAt: expect.any(Date),
                    emailConfirmation: {
                        confirmationCode: expect.any(String),
                        expirationDate: expect.any(Date),
                        isConfirmed: expect.any(Boolean)
                    }
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

    // email confirmation

    // email resending
})