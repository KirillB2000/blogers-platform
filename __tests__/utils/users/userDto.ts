import { UserInputModel } from "../../../src/users/input/dto/userInputModel"

export const userDto = (): UserInputModel => {
    return {
        login: 'TestLogin',
        password: 'testPassword',
        email: 'kiril.byckov.2000@gmail.com'
    }
}