import { WithId } from "mongodb"
import { User } from "../domain/user"
import { UserViewModel } from "../output/userViewModel"

export const mapUserDomaiToViewModel = (
    domain: WithId<User>
): UserViewModel => {
    return {
        id: domain._id.toString(),
        login: domain.login,
        email: domain.email,
        createdAt: domain.createdAt
    }
}