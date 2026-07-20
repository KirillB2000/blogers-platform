import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsServices } from "../../application/posts.services";

export const updatePostById = async (
  req: Request<{ id: string }, {}, postInputModel>,
  res: Response,
) => {
  try {
    const isUpdated: boolean | null = await postsServices.update(req.params.id, req.body);

    if (isUpdated === null) {
      res.status(httpStatuses.BadRequest).json({message: 'Blog should exist', field: 'blogId'});
      return;
    }
  
    if (!isUpdated) {
      res.sendStatus(httpStatuses.NotFound)
      return;
    }
  
    res.sendStatus(httpStatuses.NoContent);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
