import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsServices } from "../../application/posts.services";

export const deletePostById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const isDeleted = await postsServices.delete(req.params.id);
  
    if (!isDeleted) {
      res.sendStatus(httpStatuses.NotFound);
      return;
    }
  
    res.sendStatus(httpStatuses.NoContent);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
