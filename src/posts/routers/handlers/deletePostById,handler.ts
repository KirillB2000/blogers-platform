import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const deletePostById = (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = postsRepository.delete(req.params.id);

  if (!isDeleted) {
    res.sendStatus(httpStatuses.NotFound);
    return;
  }

  res.sendStatus(httpStatuses.NoContent);
};
