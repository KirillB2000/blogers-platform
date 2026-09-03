import { Request, Response } from "express";
import { BlogViewModel } from "../output/blog-data.output";
import { blogsQwRepository } from "../../infrastructure/blogs.queryRepository";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const blogId = req.params.id;

  const blogById: BlogViewModel = await blogsQwRepository.findById(blogId);

  res.status(httpStatuses.Ok).json(blogById);
};
