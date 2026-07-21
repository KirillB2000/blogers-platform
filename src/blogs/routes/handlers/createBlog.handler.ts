import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { Blog } from "../../domain/blog";
import { WithId } from "mongodb";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";
import { blogsService } from "../../application/blogs.services";
import { BlogViewModel } from "../output/blog-data.output";

export const createBlogHandler = async (
  req: Request<{}, {}, blogInputModel>,
  res: Response,
) => {
  try {
    const createdNewBlog: WithId<Blog> = await blogsService.create(req.body);
  
    const blogForResponse: BlogViewModel = mapToBlogViewModel(createdNewBlog)
  
    res.status(httpStatuses.Created).json(blogForResponse);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
