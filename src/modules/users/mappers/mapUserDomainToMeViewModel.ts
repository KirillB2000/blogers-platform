import { MeViewModel } from "../../auth/api/output/me-output.type";
import { UsersDocument } from "../infrastructure/users.model";

export const mapUserDomainToMeViewModel = (
    userDomain: UsersDocument
): MeViewModel => {
    return {
        email: userDomain.email,
        login: userDomain.login,
        userId: userDomain._id.toString()
    }
}