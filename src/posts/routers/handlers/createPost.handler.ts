import { Request, Response } from "express";
import { postInputModel } from "../../dto/postInputModel";
import { postViewModel } from "../../types/postViewModel";
import { blogsRepository } from "../../../blogs/repositories/blogs.repository";
import { httpStatuses } from "../../../core/types/http-statuses";
import { postsRepository } from "../../repositories/posts.repository";
import { Post } from "../../types/post";
import { mapPostInputDtoToDbType } from "../mappers/map-from-post-input-dto-to-db-type";
import { WithId } from "mongodb";
import { mapToPostViewModel } from "../mappers/map-from-post-db-type-to-view-model";

export const createPost = async (
  req: Request<{}, {}, postInputModel>,
  res: Response<postViewModel | { message: string; field: string }>,
) => {
  const blogById = await blogsRepository.findById(req.body.blogId);

  if (!blogById) {
    res.sendStatus(httpStatuses.BadRequest).json({message: 'Blog should exist', field: 'blogId'});
    return;
  }

  const newPost: Post = {
    ...mapPostInputDtoToDbType(req.body),
    blogId: blogById!._id.toString(),
    blogName: blogById!.name,
    createdAt: new Date()
  }

  const createdPost: WithId<Post> = await postsRepository.create(newPost);

  const postDataForResponse: postViewModel = mapToPostViewModel(createdPost)

  res.status(httpStatuses.Created).json(postDataForResponse);
};
