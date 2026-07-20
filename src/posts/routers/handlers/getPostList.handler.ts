import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { WithId } from "mongodb";
import { Post } from "../../types/post";
import { postViewModel } from "../../types/postViewModel";
import { postsServices } from "../../application/posts.services";

export const getPostListHandler = async (req: Request, res: Response) => {
  try {
    const posts: WithId<Post>[] = await postsServices.findMany()
  
    const postViewModels: postViewModel[] = posts.map(mapToPostViewModel)
  
    res.status(httpStatuses.Ok).json(postViewModels)
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
