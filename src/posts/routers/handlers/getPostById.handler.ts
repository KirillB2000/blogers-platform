import { Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postViewModel } from "../../types/postViewModel";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";
import { WithId } from "mongodb";
import { Post } from "../../types/post";

export const getPostByIdHandler = async (
  req: Request<{id: string}>, 
  res: Response) => {
    try {
      const postId = req.params.id
  
      const post: WithId<Post> | null = await postsRepository.findById(postId);
  
      if (!post) {
        res.sendStatus(httpStatuses.NotFound);
        return;
      }
  
      const postDataForResponse: postViewModel = mapToPostViewModel(post)
  
      res.status(httpStatuses.Ok).json(postDataForResponse);
    } catch (error) {
      res.status(httpStatuses.InternalServerError).json({error})
    }
};
