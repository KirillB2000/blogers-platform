import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsServices } from "../../application/posts.services";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const deletePostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted = await postsServices.delete(req.params.id);

  if (!isDeleted) {
    throw new NotFoundError('Post not found')
  }

  res.sendStatus(httpStatuses.NoContent);
};
