import { Request, Response } from "express";
import { blogInputModel } from "../input/dto/blogInputModel";
import { blogsService } from "../../application/blogs.services";
import { BlogViewModel } from "../output/blog-data.output";
import { blogsQwRepository } from "../../infrastructure/blogs.queryRepository";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const createBlogHandler = async (
  req: Request<{}, {}, blogInputModel>,
  res: Response,
) => {
  const blogsId = await blogsService.create(req.body);
  const createdObject: BlogViewModel = await blogsQwRepository.findById(blogsId)
  
  res.status(httpStatuses.Created).json(createdObject);
}
