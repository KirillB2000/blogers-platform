import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postViewModel } from "../../types/postViewModel";
import { httpStatuses } from "../../../core/types/http-statuses";
import { Post } from "../../types/post";
import { WithId } from "mongodb";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { postsServices } from "../../application/posts.services";

export const createPost = async (
  req: Request<{}, {}, postInputModel>,
  res: Response,
) => {
  try {
    const createdPost: WithId<Post> | null = await postsServices.create(req.body, req.body.blogId);
  
    if (!createdPost) {
      res.status(httpStatuses.BadRequest).json({message: 'Blog should exist', field: 'blogId'});
      return;
    }
  
  
    const postDataForResponse: postViewModel = mapToPostViewModel(createdPost)
  
    res.status(httpStatuses.Created).json(postDataForResponse);
  } catch (error) {
    res.status(httpStatuses.InternalServerError).json({error})
  }
};
