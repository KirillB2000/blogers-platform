import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UserInputModel } from "../api/input/dto/userInputModel";
import { UsersType } from "../infrastructure/users.model";

export const mapUserInputToIDbType = (
    userDto: UserInputModel,
    passwordHash: string
): UsersType => {
    return {
        login: userDto.login,
        email: userDto.email,
        password: passwordHash,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: 5 }),
            isConfirmed: false
        },
        passwordRecovery: {
            recoveryCode: null,
            expirationDate: null
        }
    }
}