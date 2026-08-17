import { WithId } from "mongodb"
import { IUserDB } from "../input/domain/iUserDb"
import { UserViewModel } from "../output/userViewModel"

export const mapUserDomaiToViewModel = (
    domain: WithId<IUserDB>
): UserViewModel => {
    return {
        id: domain._id.toString(),
        login: domain.login,
        email: domain.email,
        createdAt: domain.createdAt
    }
}