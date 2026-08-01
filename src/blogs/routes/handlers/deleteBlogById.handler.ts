import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";

export const deleteBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {

  await blogsService.delete(req.params.id);
  
  res.sendStatus(httpStatuses.NoContent);
};
