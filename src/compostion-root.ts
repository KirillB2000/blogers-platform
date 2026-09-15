import { BcryptService } from "./modules/auth/adapters/bcrypt.services";
import { JwtService } from "./modules/auth/adapters/jwt.services";
import { NodemailerService } from "./modules/auth/adapters/nodemailer.services";
import { AuthController } from "./modules/auth/api/auth.controller";
import { AuthServiceHelpers } from "./modules/auth/application/auth.serviceHelpers";
import { AuthService } from "./modules/auth/application/auth.services";
import { SessionsQueryReposiroty } from "./modules/auth/infrastructure/sessions.queryRepository";
import { SessionsRepository } from "./modules/auth/infrastructure/sessions.repository";
import { SecurityDevicesController } from "./modules/securityDevices/api/securityDevices.controller";
import { SecurityDevicesService } from "./modules/securityDevices/application/commands/securityDevices.services";
import { SecurityDevicesQueryService } from "./modules/securityDevices/application/queries/securityDevices.queryServices";
import { UsersController } from "./modules/users/api/users.controller";
import { UsersService } from "./modules/users/application/users.services";
import { UsersQwRepository } from "./modules/users/infrastructure/user.queryRepository";
import { UsersRepository } from "./modules/users/infrastructure/user.repository";

// Global services
export const bcryptService = new BcryptService()
export const nodemailerService = new NodemailerService()
export const jwtService = new JwtService()

// User module
export const usersRepository = new UsersRepository()
export const usersQwRepository = new UsersQwRepository()

export const usersService = new UsersService(usersRepository, bcryptService)

export const usersController = new UsersController(usersService, usersQwRepository)

// Auth module
export const sessionsRepository = new SessionsRepository()
export const sessionQueryRepository = new SessionsQueryReposiroty()

export const authServiceHelpers = new AuthServiceHelpers(usersRepository, jwtService)
export const authService = new AuthService(sessionsRepository, usersRepository, authServiceHelpers, jwtService, bcryptService, nodemailerService)

export const authController = new AuthController(authService, usersQwRepository)

// SecurityDevices module
export const securityDevicesService = new SecurityDevicesService(authServiceHelpers, sessionsRepository)
export const securityDevicesQueryService = new SecurityDevicesQueryService(sessionQueryRepository, authServiceHelpers)

export const securityDevicesController = new SecurityDevicesController(securityDevicesService, securityDevicesQueryService)