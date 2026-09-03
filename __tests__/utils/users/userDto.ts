import { UserInputModel } from "../../../src/modules/users/api/input/dto/userInputModel"

export const userDto = (): UserInputModel => {
    return {
        login: 'TestLogin',
        password: 'testPassword',
        email: 'kiril.byckov.2000@gmail.com'
    }
}