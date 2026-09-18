import { ObjectId } from "mongodb";
import { BadRequestError, NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { mapUserInputToIDbType } from "../mappers/mapUserInputToIDbType";
import { UserInputModel } from "../api/input/dto/userInputModel";
import { IUserDB } from "../domain/iUserDb";
import { UsersRepository } from "../infrastructure/user.repository";
import { BcryptService } from "../../auth/adapters/bcrypt.services";
import { injectable } from "inversify";

@injectable()
export class UsersService {

    constructor (
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService
    ) {}

    async create (
        dto: UserInputModel
    ): Promise<ObjectId> {

        const existingUserEmail = await this.usersRepository.findByEmail(dto.email)
        if (existingUserEmail) {
            throw new BadRequestError([{ message: 'Email must be unique', field: 'email' }])
        }

        const existingUserLogin = await this.usersRepository.findByLogin(dto.login)
        if (existingUserLogin) {
            throw new BadRequestError([{ message: 'Login must be unique', field: 'login' }])
        }

        const hashedPassword = await this.bcryptService.generateHash(dto.password)

        const dbUser: IUserDB = mapUserInputToIDbType(dto, hashedPassword)

        const userId = await this.usersRepository.create(dbUser)

        return userId
    }

    async delete(id: string): Promise<void> {
        const isDeleted = await this.usersRepository.delete(id)

        if (!isDeleted) {
            throw new NotFoundError('User not found')
        }
    }
}