import { ObjectId, WithId } from "mongodb";
import { injectable } from "inversify";
import { UsersDocument, UsersModel, UsersType } from "./users.model";


@injectable()
export class UsersRepository {
    async create (userDomain: UsersType) {
        const user = await UsersModel.insertOne(userDomain)

        return user.id
    }

    async findByLogin(loginDto: string) {
        return await UsersModel.findOne({ login: loginDto })
    }

    async findByEmail(emailDto: string) {
        return await UsersModel.findOne({ email: emailDto })
    }

    async findById(
        userId: string
    ): Promise<UsersDocument | null> {
        return await UsersModel.findOne({_id: new ObjectId(userId)})
    }

    async findByLoginOrEmailField(loginOrEmail: string) {
        return await UsersModel.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}]
        })
    }

    async delete (id: string): Promise<boolean> {
        const deletedCount = await UsersModel.deleteOne({_id: new ObjectId(id)})

        return deletedCount.deletedCount > 0
    }

    async confirmEmail(id: string): Promise<void> {
        await UsersModel.updateOne(
            {_id: new ObjectId(id)},
            { $set: {"emailConfirmation.isConfirmed": true}}
        )
    }

    async updateConfirmationCode(
        userId: string,
        confirmationCode: string,
        expirationDate: Date
    ): Promise<void> {
        await UsersModel.updateOne(
            {_id: new ObjectId(userId)},
            { $set: { "emailConfirmation.confirmationCode": confirmationCode, "emailConfirmation.expirationDate": expirationDate}}
        )
    }

    async updateRecoveryPasswordCode(
        email: string,
        recoveryCode: string,
        expirationDate: Date
    ): Promise<void> {
        await UsersModel.updateOne(
            { email: email },
            { $set: { 'passwordRecovery.recoveryCode': recoveryCode, 'passwordRecovery.expirationDate': expirationDate }}
        )
    }

    async findByRecoveryCode (
        recoveryCode: string
    ): Promise<UsersDocument | null> {
        const user = UsersModel.findOne(
            { 'passwordRecovery.recoveryCode': recoveryCode }
        )

        return user
    }

    async updatePasswordAndRecoveryPassword (
        newPassword: string, 
        userId: string
    ) {
        await UsersModel.updateOne(
            {_id: new ObjectId(userId)},
            {$set: {
                password: newPassword,
                'passwordRecovery.recoveryCode': null,
                'passwordRecovery.expirationDate': null
            }}
        )
    }
}