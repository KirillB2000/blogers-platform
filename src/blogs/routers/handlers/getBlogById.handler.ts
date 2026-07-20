import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogViewModel } from "../../types/blogViewModel";
import { WithId } from "mongodb";
import { Blog } from "../../types/blog";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";
import { blogsService } from "../../application/blogs.services";

export const getBlogByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const blogId = req.params.id;
  
    const blog: WithId<Blog> | null = await blogsService.findById(blogId);
  
    if (!blog) {
      res.sendStatus(httpStatuses.NotFound);
      return;
    }
  
    const blogForResponse: blogViewModel = mapToBlogViewModel(blog)
  
    res.status(httpStatuses.Ok).json(blogForResponse);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
