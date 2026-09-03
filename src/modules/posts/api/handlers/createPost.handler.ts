import { Request, Response } from "express";
import { PostInputModel } from "../input/dto/postInputModel";
import { PostViewModel } from "../output/post-data.output";
import { ObjectId } from "mongodb";
import { postsServices } from "../../application/posts.services";
import { blogsQwRepository } from "../../../blogs/infrastructure/blogs.queryRepository";
import { BlogViewModel } from "../../../blogs/api/output/blog-data.output";
import { postsQwRepository } from "../../infrastructure/posts.queryRepository";
import { BadRequestError } from "../../../../core/exceptions/app-errors.exeption";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const createPostHandler = async (
  req: Request<{}, {}, PostInputModel>,
  res: Response,
) => {
  const blogById: BlogViewModel = await blogsQwRepository.findById(req.body.blogId);

  if (!blogById) {
    throw new BadRequestError([{ message: 'Blog should exist', field: 'blogId' }])
  }

  const createdPostId: ObjectId = await postsServices.create(req.body);

  const createdPostForResponse : PostViewModel = await postsQwRepository.findById(createdPostId)

  res.status(httpStatuses.Created).json(createdPostForResponse);
};
