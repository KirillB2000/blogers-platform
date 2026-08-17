import { ObjectId } from "mongodb";
import { usersCollection } from "../../db/collections";
import { IUserDB } from "../input/domain/iUserDb";


export const usersRepository = {
    async create (userDomain: IUserDB) {
        const user = await usersCollection.insertOne(userDomain)

        return user.insertedId
    },

    async findByLogin(loginDto: string) {
        return await usersCollection.findOne({ login: loginDto })
    },

    async findByEmail(emailDto: string) {
        return await usersCollection.findOne({ login: emailDto })
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

    async confirmEmail(id: string): Promise<void> {
        await usersCollection.updateOne(
            {_id: new ObjectId(id)},
            { $set: {"emailConfirmation.isConfirmed": true}}
        )
    },

    async updateConfirmationCode(
        userId: string,
        confirmationCode: string,
        expirationDate: Date
    ): Promise<void> {
        await usersCollection.updateOne(
            {_id: new ObjectId(userId)},
            { $set: { "emailConfirmation.confirmationCode": confirmationCode, "emailConfirmation.expirationDate": expirationDate}}
        )
    }
}