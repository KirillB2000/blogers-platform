import { Request, Response } from "express";
import { blogInputModel } from "../../dto/blogInputModel";
import { blogViewModel } from "../../types/blogViewModel";
import { blogsRepository } from "../../repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { mapBlogInputDtoToDbType } from "../mappers/map-from-blog-input-dto-to-db-type";
import { Blog } from "../../types/blog";
import { WithId } from "mongodb";
import { mapToBlogViewModel } from "../mappers/map-from-blog-db-type-to-view-model";

export const createBlogHandler = async (
  req: Request<{}, {}, blogInputModel>,
  res: Response<blogViewModel>,
) => {
  const newBlog: Blog = {
    ...mapBlogInputDtoToDbType(req.body),
    createdAt: new Date(),
    isMembership: false
  }

  const createdNewBlog: WithId<Blog> = await blogsRepository.create(newBlog);

  const blogForResponse: blogViewModel = mapToBlogViewModel(createdNewBlog)

  res.status(httpStatuses.Created).json(blogForResponse);
};
