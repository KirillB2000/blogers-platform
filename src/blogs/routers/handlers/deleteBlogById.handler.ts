import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const deleteBlogById = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await blogsRepository.delete(req.params.id);

  if (!isDeleted) {
    res.sendStatus(httpStatuses.NotFound);
    return;
  }

  res.sendStatus(httpStatuses.NoContent);
};
