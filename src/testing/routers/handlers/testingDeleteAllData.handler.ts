import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { BlogsModel } from "../../../modules/blogs/infrastructure/blogs.model";
import { PostsModel } from "../../../modules/posts/infrastructure/posts.model";
import { UsersModel } from "../../../modules/users/infrastructure/users.model";
import { CommentsModel } from "../../../modules/comments/infrastructure/comments.model";
import { ApiRequestLogModel } from "../../../core/middlewares/rateLimiter/infrastructure/rateLimitModel";

export const testingDeleteAllDataHandler = async (req: Request, res: Response) => {
  await PostsModel.deleteMany({})
  await BlogsModel.deleteMany({})
  await UsersModel.deleteMany({})
  await CommentsModel.deleteMany({})
  await ApiRequestLogModel.deleteMany({})


  res.sendStatus(httpStatuses.NoContent)
};
