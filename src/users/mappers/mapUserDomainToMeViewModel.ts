import { WithId } from "mongodb";
import { IUserDB } from "../input/domain/iUserDb";
import { MeViewModel } from "../../auth/output/me-output.type";

export const mapUserDomainToMeViewModel = (
    userDomain: WithId<IUserDB> 
): MeViewModel => {
    return {
        email: userDomain.email,
        login: userDomain.login,
        userId: userDomain._id.toString()
    }
}