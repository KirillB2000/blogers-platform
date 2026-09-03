import { Request, Response } from "express";
import { blogsService } from "../../application/blogs.services";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const deleteBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {

  await blogsService.delete(req.params.id);
  
  res.sendStatus(httpStatuses.NoContent);
};
