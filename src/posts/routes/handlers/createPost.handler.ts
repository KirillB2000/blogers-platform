import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postViewModel } from "../output/post-data.output";
import { httpStatuses } from "../../../core/types/http-statuses";
import { Post } from "../../domain/post";
import { WithId } from "mongodb";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { postsServices } from "../../application/posts.services";
import { BadRequestError } from "../../../core/exceptions/app-errors.exeption";

export const createPostHandler = async (
  req: Request<{}, {}, postInputModel>,
  res: Response,
) => {
  const createdPost: WithId<Post> | null = await postsServices.create(req.body);

  if (!createdPost) {
    throw new BadRequestError([{message: 'Blog should exist', field: 'blogId'}])
  }

  const postDataForResponse: postViewModel = mapToPostViewModel(createdPost)

  res.status(httpStatuses.Created).json(postDataForResponse);
};
