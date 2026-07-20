import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";

export const updateBlogById = async (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response,
) => {
  try {
    const isUpdated: boolean = await blogsService.update(req.params.id, req.body);
  
    if (!isUpdated) {
      res.sendStatus(httpStatuses.NotFound)
      return;
    }
  
    res.sendStatus(httpStatuses.NoContent);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
