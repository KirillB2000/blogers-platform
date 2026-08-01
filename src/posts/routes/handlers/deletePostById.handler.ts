import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsServices } from "../../application/posts.services";

export const deletePostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {

  await postsServices.delete(req.params.id)

  res.sendStatus(httpStatuses.NoContent);
};
