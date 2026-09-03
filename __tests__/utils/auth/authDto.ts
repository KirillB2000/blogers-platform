import { LoginInputModel } from "../../../src/modules/auth/api/input/dto/loginInputModel";

export const authDto = (userLoginOrEmail: string, userPassword: string): LoginInputModel => {
    return {
        loginOrEmail: userLoginOrEmail,
        password: userPassword
    }
}