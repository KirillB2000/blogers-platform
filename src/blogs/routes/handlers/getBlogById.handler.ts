import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";
import { blogsService } from "../../application/blogs.services";
import { BlogViewModel } from "../output/blog-data.output";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const blogId = req.params.id;

  const blog: WithId<Blog> | null = await blogsService.findById(blogId);
  if (!blog) {
    throw new NotFoundError('Blog not found')
  }

  const blogForResponse: BlogViewModel = mapToBlogViewModel(blog)

  res.status(httpStatuses.Ok).json(blogForResponse);
};
