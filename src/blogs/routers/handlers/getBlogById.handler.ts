import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogViewModel } from "../../types/blogViewModel";
import { WithId } from "mongodb";
import { Blog } from "../../types/blog";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response<blogViewModel>,
) => {
  const blogId = req.params.id;

  const blog: WithId<Blog> | null = await blogsRepository.findById(blogId);

  if (!blog) {
    res.sendStatus(httpStatuses.NotFound);
    return;
  }

  const blogForResponse: blogViewModel = mapToBlogViewModel(blog)

  res.status(httpStatuses.Ok).json(blogForResponse);
};
