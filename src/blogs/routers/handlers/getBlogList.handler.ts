import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const getBlogListHanlder = (req: Request, res: Response) => {
  res.status(httpStatuses.Ok).json(blogsRepository.findAll());
};
