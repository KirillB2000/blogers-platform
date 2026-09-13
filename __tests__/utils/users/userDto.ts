import { UserInputModel } from "../../../src/modules/users/api/input/dto/userInputModel"

export const userDto = (): UserInputModel => {
    return {
        login: 'TestLogin',
        password: 'testPassword',
        email: 'example_example@example.com'
    }
}