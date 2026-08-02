import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";

export const updateBlogByIdHandler = async (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response,
) => {

  await blogsService.update(req.params.id, req.body);
  
  res.sendStatus(httpStatuses.NoContent);
};
