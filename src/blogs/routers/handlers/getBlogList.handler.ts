import { Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { Blog } from "../../types/blog";
import { blogViewModel } from "../../types/blogViewModel";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";

export const getBlogListHandler = async (req: Request, res: Response) => {
  const blogs: WithId<Blog>[] = await blogsRepository.findAll()

  const blogsForResponse: blogViewModel[] = blogs.map(mapToBlogViewModel)

  res.status(httpStatuses.Ok).json(blogsForResponse)
};
