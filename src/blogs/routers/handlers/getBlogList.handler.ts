import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsService } from "../../application/blogs.services";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";
import { WithId } from "mongodb";
import { Blog } from "../../types/blog";

export const getBlogListHandler = async (req: Request, res: Response) => {
  try {
    const blogs: WithId<Blog>[] = await blogsService.findMany()
  
    const blogsForResponse: blogViewModel[] = blogs.map(mapToBlogViewModel)
  
    res.status(httpStatuses.Ok).json(blogsForResponse)
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
