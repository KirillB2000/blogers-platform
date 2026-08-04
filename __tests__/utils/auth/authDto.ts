import { LoginInputModel } from "../../../src/auth/dto/authInputModel";

export const authDto = (userLoginOrEmail: string, userPassword: string): LoginInputModel => {
    return {
        loginOrEmail: userLoginOrEmail,
        password: userPassword
    }
}