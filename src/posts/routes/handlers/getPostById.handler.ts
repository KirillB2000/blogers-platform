import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postViewModel } from "../output/post-data.output";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { NotFoundError } from "../../../core/exceptions/app-errors.exeption";

export const getPostByIdHandler = async (
  req: Request<{id: string}>, 
  res: Response) => {
    const postId = req.params.id

    const post: WithId<Post> | null = await postsRepository.findById(postId);

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    const postDataForResponse: postViewModel = mapToPostViewModel(post)

    res.status(httpStatuses.Ok).json(postDataForResponse);
};
