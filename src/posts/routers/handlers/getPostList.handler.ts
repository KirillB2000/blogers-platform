import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { WithId } from "mongodb";
import { Post } from "../../types/post";
import { postViewModel } from "../../types/postViewModel";

export const getPostListHandler = async (req: Request, res: Response) => {
  const posts: WithId<Post>[] = await postsRepository.findAll()

  const postViewModels: postViewModel[] = posts.map(mapToPostViewModel)

  res.status(httpStatuses.Ok).json(postViewModels)
};
