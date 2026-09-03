import { Request, Response } from "express";
import { BlogQueryInput } from "../input/blog-query.input";
import { BlogListPaginatedOutput } from "../output/blog-list-paginator.output";
import { blogsQwRepository } from "../../infrastructure/blogs.queryRepository";
import { PagindatedOutput } from "../../../../core/types/paginated.output";
import { httpStatuses } from "../../../../core/types/http-statuses";
import { mapToBlogListPaginatedOutput } from "../../mappers/map-from-blog-domain-to-blog-list-paginated-output";

export const getBlogListHandler = async (
  req: Request<{}, {}, {}, BlogQueryInput>, 
  res: Response
) => {
  const queryInput = req.query
  const { items, totalCount } = await blogsQwRepository.findMany(queryInput)

  const pagesCount = Math.ceil(totalCount / queryInput.pageSize)
  const meta: PagindatedOutput = {
    pagesCount: pagesCount,
    page: queryInput.pageNumber,
    pageSize: queryInput.pageSize,
    totalCount: totalCount
  }

  const blogListOutput: BlogListPaginatedOutput = mapToBlogListPaginatedOutput(items, meta)
  
  res.status(httpStatuses.Ok).send(blogListOutput)
};
