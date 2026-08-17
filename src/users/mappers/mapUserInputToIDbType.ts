import { randomUUID } from "crypto";
import { UserInputModel } from "../input/dto/userInputModel";
import { add } from "date-fns";
import { IUserDB } from "../input/domain/iUserDb";

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