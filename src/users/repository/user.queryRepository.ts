import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/collections";
import { mapUserDomaiToViewModel } from "../mappers/mapUserDomaiToViewModel";
import { NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { UserViewModel } from "../output/userViewModel";


export const userQwRepository = {
    async findById (
        id: string | ObjectId
    ): Promise<UserViewModel> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})

        if(!user) {
            throw new NotFoundError('User not found')
        }

        const userForResponse: UserViewModel = mapUserDomaiToViewModel(user)

        return userForResponse
    }
}