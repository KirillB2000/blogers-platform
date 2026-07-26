import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const deleteBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  const isDeleted: boolean = await blogsService.delete(req.params.id);  
  if (!isDeleted) {
    throw new NotFoundError('Blog not found')
  }
  
  res.sendStatus(httpStatuses.NoContent);
};
