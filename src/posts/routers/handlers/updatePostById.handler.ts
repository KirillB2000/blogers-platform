import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const updatePostById = async (
  req: Request<{ id: string }, {}, postInputModel>,
  res: Response,
) => {
  const isUpdated = await postsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res.sendStatus(httpStatuses.NotFound)
    return;
  }

  res.sendStatus(httpStatuses.NoContent);
};
