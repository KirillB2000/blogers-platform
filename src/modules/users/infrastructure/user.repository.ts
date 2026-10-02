import { ObjectId } from "mongodb";
import { injectable } from "inversify";
import { UsersDocument, UsersModel } from "./users.model";


@injectable()
export class UsersRepository {
    async save (user: UsersDocument) {
        await user.save()
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

    async findByRecoveryCode (
        recoveryCode: string
    ): Promise<UsersDocument | null> {
        const user = await UsersModel.findOne(
            { 'passwordRecovery.recoveryCode': recoveryCode }
        )
        return user
    }
}