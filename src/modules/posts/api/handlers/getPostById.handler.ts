import { Request, Response } from "express";
import { PostViewModel } from "../output/post-data.output";
import { postsQwRepository } from "../../infrastructure/posts.queryRepository";
import { httpStatuses } from "../../../../core/types/http-statuses";

export const getPostByIdHandler = async (
  req: Request<{id: string}>, 
  res: Response) => {
    const postId = req.params.id

    const postById: PostViewModel = await postsQwRepository.findById(postId);

  res.status(httpStatuses.Ok).json(postById);
};
