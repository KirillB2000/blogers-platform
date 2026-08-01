import { Request, Response } from "express";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postViewModel } from "../output/post-data.output";
import { postsQwRepository } from "../../repositories/posts.queryRepository";

export const getPostByIdHandler = async (
  req: Request<{id: string}>, 
  res: Response) => {
    const postId = req.params.id

    const postById: postViewModel = await postsQwRepository.findById(postId);

  res.status(httpStatuses.Ok).json(postById);
};
