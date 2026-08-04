import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/collections";
import { User } from "../domain/user";


export const usersRepository = {
    async create (userDomain: User) {
        const user = await usersCollection.insertOne(userDomain)

        return user.insertedId
    },

    async findByLoginOrEmail(login: string, email: string) {
        return await usersCollection.findOne({
            $or: [{login}, {email}]
        })
    },

    async findByLoginOrEmailField(loginOrEmail: string) {
        return await usersCollection.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}]
        })
    },

    async delete (id: string): Promise<boolean> {
        const deletedCount = await usersCollection.deleteOne({_id: new ObjectId(id)})

        return deletedCount.deletedCount > 0
    },
}