import { Request, Response } from "express";
import { PostInputModel } from "../input/dto/postInputModel";
import { postsServices } from "../../application/posts.services";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const updatePostByIdHandler = async (
  req: Request<{ id: string }, {}, PostInputModel>,
  res: Response,
) => {
  await postsServices.update(req.params.id, req.body);

  res.sendStatus(httpStatuses.NoContent);
};
