import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const createBlogHandler = (
  req: Request<{}, {}, blogInputModel>,
  res: Response<blogViewModel>,
) => {
  const newBlog: Omit<blogViewModel, "id"> = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  const createdNewBlog = blogsRepository.create(newBlog);

  res.status(httpStatuses.Created).json(createdNewBlog);
};
