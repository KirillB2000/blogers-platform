import { User } from "../domain/user";
import { UserInputModel } from "../dto/userInputModel";

export const mapUserInputToDbType = (
    dto: UserInputModel
): User => {
    return {
        ...dto,
        createdAt: new Date()
    }
} 