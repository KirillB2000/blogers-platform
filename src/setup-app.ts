import express, { Express } from "express";
import { blogsRouter } from "./blogs/routes/blogs.router";
import { postsRouter } from "./posts/routes/posts.router";
import { BLOGS_PATH } from "./blogs/constants/blogs.paths";
import { POSTS_PATH } from "./posts/constants/posts.paths";
import { TESTING_PATH } from "./testing/constants/testing.paths";
import { testingRouter } from "./testing/routers/testing.router";
import { errorsHandler } from "./core/exceptions/error.handler";
import { USERS_PATH } from "./users/constants/users.paths";
import { userRouter } from "./users/routes/users.router";
import { AUTH_PATH } from "./auth/constants/auth.paths";
import { COMMENTS_PATH } from "./comments/constants/comments.paths";
import { commentsRouter } from "./comments/routes/comments.router";
import cookieParser from "cookie-parser";
import { authRouter } from "./auth/api/routes/auth.router";

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