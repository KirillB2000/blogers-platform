import { LoginInputModel } from "../../../src/auth/input/dto/loginInputModel";

export const authDto = (userLoginOrEmail: string, userPassword: string): LoginInputModel => {
    return {
        loginOrEmail: userLoginOrEmail,
        password: userPassword
    }
}