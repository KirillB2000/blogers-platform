import { WithId } from "mongodb";
import { User } from "../domain/user";
import { MeViewModel } from "../../auth/output/me-output.type";

export const mapUserDomainToMeViewModel = (
    userDomain: WithId<User> 
): MeViewModel => {
    return {
        email: userDomain.email,
        login: userDomain.login,
        userId: userDomain._id.toString()
    }
}