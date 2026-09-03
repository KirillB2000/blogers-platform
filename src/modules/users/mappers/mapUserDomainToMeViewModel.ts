import { WithId } from "mongodb";
import { MeViewModel } from "../../auth/api/output/me-output.type";
import { IUserDB } from "../domain/iUserDb";

export const mapUserDomainToMeViewModel = (
    userDomain: WithId<IUserDB> 
): MeViewModel => {
    return {
        email: userDomain.email,
        login: userDomain.login,
        userId: userDomain._id.toString()
    }
}