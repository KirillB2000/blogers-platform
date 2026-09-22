import { UserViewModel } from "../api/output/userViewModel"
import { UsersDocument } from "../infrastructure/users.model"


export const mapUserDomaiToViewModel = (
    domain: UsersDocument
): UserViewModel => {
    return {
        id: domain._id.toString(),
        login: domain.login,
        email: domain.email,
        createdAt: domain.createdAt
    }
}