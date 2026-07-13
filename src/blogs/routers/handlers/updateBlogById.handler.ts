import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const updateBlogById = async (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response<blogViewModel>,
) => {
  const isUpdated = await blogsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res.sendStatus(httpStatuses.NotFound)
    return;
  }

  res.sendStatus(httpStatuses.NoContent);
};
