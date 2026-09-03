import { WithId } from "mongodb"
import { UserViewModel } from "../api/output/userViewModel"
import { IUserDB } from "../domain/iUserDb"


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