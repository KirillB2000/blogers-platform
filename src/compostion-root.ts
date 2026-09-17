import { BcryptService } from "./modules/auth/adapters/bcrypt.services";
import { JwtService } from "./modules/auth/adapters/jwt.services";
import { NodemailerService } from "./modules/auth/adapters/nodemailer.services";
import { AuthController } from "./modules/auth/api/auth.controller";
import { AuthServiceHelpers } from "./modules/auth/application/auth.serviceHelpers";
import { AuthService } from "./modules/auth/application/auth.services";
import { SessionsQwReposiroty } from "./modules/auth/infrastructure/sessions.queryRepository";
import { SessionsRepository } from "./modules/auth/infrastructure/sessions.repository";
import { BlogsController } from "./modules/blogs/api/blogs.controller";
import { BlogsService } from "./modules/blogs/application/blogs.services";
import { BlogsQwRepository } from "./modules/blogs/infrastructure/blogs.queryRepository";
import { BlogsRepository } from "./modules/blogs/infrastructure/blogs.repository";
import { CommentsController } from "./modules/comments/api/comments.controller";
import { CommentsService } from "./modules/comments/application/comments.services";
import { CommentsQwRepository } from "./modules/comments/infrastructure/comments.queryRepository";
import { CommentsRepository } from "./modules/comments/infrastructure/comments.repository";
import { PostsController } from "./modules/posts/api/posts.controller";
import { PostsService } from "./modules/posts/application/posts.services";
import { PostsQwRepository } from "./modules/posts/infrastructure/posts.queryRepository";
import { PostsRepository } from "./modules/posts/infrastructure/posts.repository";
import { SecurityDevicesController } from "./modules/securityDevices/api/securityDevices.controller";
import { SecurityDevicesService } from "./modules/securityDevices/application/commands/securityDevices.services";
import { SecurityDevicesQwService } from "./modules/securityDevices/application/queries/securityDevices.queryServices";
import { UsersController } from "./modules/users/api/users.controller";
import { UsersService } from "./modules/users/application/users.services";
import { UsersQwRepository } from "./modules/users/infrastructure/user.queryRepository";
import { UsersRepository } from "./modules/users/infrastructure/user.repository";

// === Reposistories ===

export const usersRepository = new UsersRepository()
export const usersQwRepository = new UsersQwRepository()

export const sessionsRepository = new SessionsRepository()
export const sessionQwRepository = new SessionsQwReposiroty()

export const commentsRepository = new CommentsRepository()
export const commentsQwRepository = new CommentsQwRepository()

export const postsRepository = new PostsRepository()
export const postsQwRepository = new PostsQwRepository()

const blogsRepository = new BlogsRepository()
const blogQwRepository = new BlogsQwRepository()

// === Infrastructure services ===

export const bcryptService = new BcryptService()
export const nodemailerService = new NodemailerService()
export const jwtService = new JwtService()

// === Application services ===

export const usersService = new UsersService(usersRepository, bcryptService)

export const authServiceHelpers = new AuthServiceHelpers(usersRepository, jwtService)
export const authService = new AuthService(
    sessionsRepository, 
    usersRepository, 
    authServiceHelpers, 
    jwtService, 
    bcryptService, 
    nodemailerService
)

export const securityDevicesService = new SecurityDevicesService(authServiceHelpers, sessionsRepository)
export const securityDevicesQwService = new SecurityDevicesQwService(sessionQwRepository, authServiceHelpers)

export const commentsService = new CommentsService(commentsRepository)

export const postsService = new PostsService(postsRepository, blogsRepository)

export const blogsService = new BlogsService(blogsRepository)

// === Controllers ===

export const usersController = new UsersController(usersService, usersQwRepository)

export const authController = new AuthController(authService, usersQwRepository, usersRepository)

export const securityDevicesController = new SecurityDevicesController(securityDevicesService, securityDevicesQwService)

export const commentsController = new CommentsController(commentsService, commentsQwRepository)

export const postsController = new PostsController(
    postsService, 
    commentsService, 
    commentsQwRepository, 
    usersQwRepository, 
    postsQwRepository, 
    blogQwRepository
)

export const blogsController = new BlogsController (
    blogsService,
    postsService,
    postsQwRepository,
    blogQwRepository
)