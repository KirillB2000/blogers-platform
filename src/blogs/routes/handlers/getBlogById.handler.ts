import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { blogsService } from "../../application/blogs.services";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";
import { BlogViewModel } from "../output/blog-data.output";
import { blogsQwRepository } from "../../repositories/blogs.queryRepository";

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const blogId = req.params.id;

  const blogById: BlogViewModel = await blogsQwRepository.findById(blogId);

  res.status(httpStatuses.Ok).json(blogById);
};
