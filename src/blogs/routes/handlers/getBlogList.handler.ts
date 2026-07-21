import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { blogsService } from "../../application/blogs.services";
import { BlogQueryInput } from "../input/blog-query.input";
import { mapToBlogListPaginatedOutput } from "../mappers/map-from-blog-domain-to-blog-list-paginated-output";
import { PagindatedOutput } from "../../../core/types/paginated.output";

export const getBlogListHandler = async (
  req: Request<{}, {}, {}, BlogQueryInput>, 
  res: Response
) => {
  try {
    const queryInput = req.query

    const { items, totalCount } = await blogsService.findMany(queryInput)

    const pagesCount = Math.ceil(totalCount / queryInput.pageSize)

    const meta: PagindatedOutput = {
      pagesCount: pagesCount,
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: totalCount
    }

    const blogListOutput = mapToBlogListPaginatedOutput(items, meta)

    res.status(httpStatuses.Ok).send(blogListOutput)
    
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
