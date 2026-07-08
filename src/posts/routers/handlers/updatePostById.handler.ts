import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const updatePostById = (
  req: Request<{ id: string }, {}, postInputModel>,
  res: Response,
) => {
  const isUpdated = postsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res
      .status(httpStatuses.NotFound)
      .json({ message: "Post not found", field: "id" });
  }

  res.sendStatus(httpStatuses.NoContent);
};
