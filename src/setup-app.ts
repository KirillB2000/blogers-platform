import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { errorsHandler } from "./core/exceptions/error.handler";
import { authRouter } from "./modules/auth/api/auth.router";
import { AUTH_PATH } from "./modules/auth/constants/auth.paths";
import { blogsRouter } from "./modules/blogs/api/blogs.router";
import { BLOGS_PATH } from "./modules/blogs/constants/blogs.paths";
import { commentsRouter } from "./modules/comments/api/comments.router";
import { COMMENTS_PATH } from "./modules/comments/constants/comments.paths";
import { postsRouter } from "./modules/posts/api/posts.router";
import { POSTS_PATH } from "./modules/posts/constants/posts.paths";
import { userRouter } from "./modules/users/api/users.router";
import { USERS_PATH } from "./modules/users/constants/users.paths";
import { TESTING_PATH } from "./testing/constants/testing.paths";
import { testingRouter } from "./testing/routers/testing.router";

const setupApp = (app: Express) => {
  app.use(express.json());
  app.use(cookieParser())

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USERS_PATH, userRouter)
  app.use(AUTH_PATH, authRouter)
  app.use(COMMENTS_PATH, commentsRouter)

  app.use(errorsHandler)

  return app;
};

export default setupApp;