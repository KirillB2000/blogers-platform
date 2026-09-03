import { authService } from "../../../src/modules/auth/application/auth.services"
import { LoginInputModel } from "../../../src/modules/auth/api/input/dto/loginInputModel"
import { userDto } from "../../utils/users/userDto"

export const testRegisterAndLoginUser = async () => {
    const userInput = userDto()
    await authService.registerUser(userInput)

    const userEmail = userInput.email

    const userCreds: LoginInputModel = {
        loginOrEmail: userInput.email,
        password: userInput.password
    }

    const { refreshToken } = await authService.loginUser(userCreds)

    return { refreshToken, userEmail }
}