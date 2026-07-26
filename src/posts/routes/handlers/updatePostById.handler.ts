import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsServices } from "../../application/posts.services";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const updatePostByIdHandler = async (
  req: Request<{ id: string }, {}, postInputModel>,
  res: Response,
) => {
  const isUpdated: boolean = await postsServices.update(req.params.id, req.body);

  if (!isUpdated) {
    throw new NotFoundError('Post not found')
  }

  res.sendStatus(httpStatuses.NoContent);
};
