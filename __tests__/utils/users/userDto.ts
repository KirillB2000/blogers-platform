import { UserInputModel } from "../../../src/users/dto/userInputModel"

export const userDto = (): UserInputModel => {
    return {
        login: 'TestLogin',
        password: 'testPassword',
        email: 'test@example.com'
    }
}