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

    const deviceName = 'Some_device_name'
    const ipAddress = '111.111.111.11'

    const { refreshToken } = await authService.loginUser(userCreds, deviceName, ipAddress)

    return { refreshToken, userEmail }
}