import { ObjectId } from "mongodb";
import { UserInputModel } from "../input/dto/userInputModel";
import { usersRepository } from "../repository/user.repository";
import { BadRequestError, NotFoundError } from "../../core/exceptions/app-errors.exeption";
import { bcryptService } from "../../auth/adapters/bcrypt.services";
import { mapUserInputToIDbType } from "../mappers/mapUserInputToIDbType";
import { IUserDB } from "../input/domain/iUserDb";

export const usersService = {
    async create (
        dto: UserInputModel
    ): Promise<ObjectId> {

        const existingUserEmail = await usersRepository.findByEmail(dto.email)
        if (existingUserEmail) {
            throw new BadRequestError([{ message: 'Email must be unique', field: 'email' }])
        }

        const existingUserLogin = await usersRepository.findByLogin(dto.login)
        if (existingUserLogin) {
            throw new BadRequestError([{ message: 'Login must be unique', field: 'login' }])
        }

        const hashedPassword = await bcryptService.generateHash(dto.password)

        const dbUser: IUserDB = mapUserInputToIDbType(dto, hashedPassword)

        const userId = await usersRepository.create(dbUser)

        return userId
    },

    async delete(id: string): Promise<void> {
        const isDeleted = await usersRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('User not found')
        }
    }
}