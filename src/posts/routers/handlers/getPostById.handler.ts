import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";

export const getPostByIdHandler = (req: Request, res: Response) => {
  const postId = req.params.id.toString();

  const post = postsRepository.findById(postId);

  if (!post) {
    res.sendStatus(httpStatuses.NotFound);
    return;
  }

  res.status(httpStatuses.Ok).json(post);
};
