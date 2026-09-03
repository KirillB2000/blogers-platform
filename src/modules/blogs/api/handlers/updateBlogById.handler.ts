import { Request, Response } from "express";
import { blogInputModel } from "../input/dto/blogInputModel";
import { blogsService } from "../../application/blogs.services";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const updateBlogByIdHandler = async (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response,
) => {

  await blogsService.update(req.params.id, req.body);
  
  res.sendStatus(httpStatuses.NoContent);
};
