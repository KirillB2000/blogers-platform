import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postViewModel } from "../output/post-data.output";
import { httpStatuses } from "../../../core/types/http-statuses";
import { ObjectId } from "mongodb";
import { postsServices } from "../../application/posts.services";
import { BadRequestError } from "../../../core/exceptions/app-errors.exeption";
import { blogsQwRepository } from "../../../blogs/repositories/blogs.queryRepository";
import { BlogViewModel } from "../../../blogs/routes/output/blog-data.output";
import { postsQwRepository } from "../../repositories/posts.queryRepository";

export const createPostHandler = async (
  req: Request<{}, {}, postInputModel>,
  res: Response,
) => {
  const blogById: BlogViewModel = await blogsQwRepository.findById(req.body.blogId);

  if (!blogById) {
    throw new BadRequestError([{ message: 'Blog should exist', field: 'blogId' }])
  }

  const createdPostId: ObjectId = await postsServices.create(req.body);

  const createdPostForResponse : postViewModel = await postsQwRepository.findById(createdPostId)

  res.status(httpStatuses.Created).json(createdPostForResponse);
};
