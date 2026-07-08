import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const updateBlogById = (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response<blogViewModel | { message: string; field: string }>,
) => {
  const isUpdated = blogsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res
      .status(httpStatuses.NotFound)
      .json({ message: "Not found blog to update", field: "id" }); // Переписать на errorHadler
    return;
  }

  res.sendStatus(httpStatuses.NoContent);
};
