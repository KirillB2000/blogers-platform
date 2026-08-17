import { UserInputModel } from "../../../src/users/input/dto/userInputModel"

export const userDto = (): UserInputModel => {
    return {
        login: 'TestLogin',
        password: 'testPassword',
        email: 'test@example.com'
    }
}