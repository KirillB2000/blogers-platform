import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { postsServices } from "../../application/posts.services";
import { PostQueryInput } from "../input/post-query.input";
import { PagindatedOutput } from "../../../core/types/paginated.output";
import { mapToPostListPaginatedOutput } from "../mappers/map-from-post-domain-to-post-paginated-output";
import { PostListPaginatorOutput } from "../output/post-list-paginator.output";

export const getPostListHandler = async (
  req: Request<{}, {}, {}, PostQueryInput>, 
  res: Response
) => {
  try {

    const queryInput = req.query

    const posts: {items: WithId<Post>[], totalCount: number} = await postsServices.findMany(queryInput)

    const pagesCount = Math.ceil(posts.totalCount / queryInput.pageSize)

    const meta: PagindatedOutput = {
      pagesCount: pagesCount,
      page: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount: posts.totalCount,
    }
  
    const postsWithPagination: PostListPaginatorOutput = mapToPostListPaginatedOutput(posts.items, meta)
  
    res.status(httpStatuses.Ok).json(postsWithPagination)
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
