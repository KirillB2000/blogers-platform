import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";
import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogDataOutput } from "../output/bloger-data.output";
import { BlogQueryInput } from "../input/blog-query.input";

export const getBlogListHandler = async (
  req: Request<{}, {}, {}, BlogQueryInput>, 
  res: Response
) => {
  try {
    const blogs: WithId<Blog>[] = await blogsService.findMany()
  
    const blogsForResponse: BlogDataOutput[] = blogs.map(mapToBlogViewModel)
  
    res.status(httpStatuses.Ok).json(blogsForResponse)
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
