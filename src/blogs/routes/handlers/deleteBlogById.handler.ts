import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";

export const deleteBlogById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const isDeleted: boolean = await blogsService.delete(req.params.id);
  
    if (!isDeleted) {
      res.sendStatus(httpStatuses.NotFound);
      return;
    }
  
    res.sendStatus(httpStatuses.NoContent);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
