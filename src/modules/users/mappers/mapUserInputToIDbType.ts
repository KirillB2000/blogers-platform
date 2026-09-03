import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UserInputModel } from "../api/input/dto/userInputModel";
import { IUserDB } from "../domain/iUserDb";

export const mapUserInputToIDbType = (
    userDto: UserInputModel,
    passwordHash: string
): IUserDB => {
    return {
        login: userDto.login,
        email: userDto.email,
        password: passwordHash,
        createdAt: new Date(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { minutes: 5 }),
            isConfirmed: false
        }
    }
}