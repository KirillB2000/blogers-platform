import 'reflect-metadata'
import { Container } from 'inversify'

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

export const container: Container = new Container()

// Global services
container.bind(BcryptService).to(BcryptService)
container.bind(JwtService).to(JwtService)
container.bind(NodemailerService).to(NodemailerService)

// Auth
container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)
container.bind(AuthServiceHelpers).to(AuthServiceHelpers)
container.bind(SessionsRepository).to(SessionsRepository)
container.bind(SessionsQwReposiroty).to(SessionsQwReposiroty)

// Security devices
container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(SecurityDevicesService).to(SecurityDevicesService)
container.bind(SecurityDevicesQwService).to(SecurityDevicesQwService)

// Users
container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQwRepository).to(UsersQwRepository)

// Comments
container.bind(CommentsController).to(CommentsController)
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(CommentsQwRepository).to(CommentsQwRepository)

// Posts
container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepository).to(PostsRepository)
container.bind(PostsQwRepository).to(PostsQwRepository)

// Blogs
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(BlogsQwRepository).to(BlogsQwRepository)