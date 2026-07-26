import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const updateBlogByIdHandler = async (
  req: Request<{ id: string }, {}, blogInputModel>,
  res: Response,
) => {
  const isUpdated: boolean = await blogsService.update(req.params.id, req.body);

  if (!isUpdated) {
    throw new NotFoundError('Blog not found')
  }

  res.sendStatus(httpStatuses.NoContent);
};
