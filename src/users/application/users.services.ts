import { ObjectId } from "mongodb";
import { UserInputModel } from "../dto/userInputModel";
import { usersRepository } from "../repository/user.repository";
import { mapUserInputToDbType } from "../mappers/mapUserInputToDbType";
import { User } from "../domain/user";
import bycrypt from 'bcrypt'
import { FieldError } from "../../core/types/errors";
import { BadRequestError, NotFoundError } from "../../core/exceptions/app-errors.exeption";

export const usersService = {
    async create (
        dto: UserInputModel
    ): Promise<ObjectId> {
        const existingUserByLoginOrEmail = await usersRepository.findByLoginOrEmail(dto.login, dto.email)
        if (existingUserByLoginOrEmail) {
            const errors: FieldError[] = []
            if (existingUserByLoginOrEmail.login === dto.login) {
                errors.push({message: 'Login must be unique', field: 'login'})
            }
            if (existingUserByLoginOrEmail.email === dto.email) {
                errors.push({ message: 'Email must be unique', field: 'email' })
            }
            throw new BadRequestError(errors)
        }
        const userDtoWithHashedPassword = {
            ...dto,
            password: await bycrypt.hash(dto.password, 10)
        }

        const userDomain: User = mapUserInputToDbType(userDtoWithHashedPassword)

        const userId = await usersRepository.create(userDomain)

        return userId
    },

    async delete(id: string): Promise<void> {
        const isDeleted = await usersRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('User not found')
        }
    }
}