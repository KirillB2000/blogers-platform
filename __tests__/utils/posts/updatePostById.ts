import { Express } from "express";
import request from "supertest";
import { postDto } from "./postDto";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { PostInputModel } from "../../../src/modules/posts/api/input/dto/postInputModel";
import { POSTS_PATH } from "../../../src/modules/posts/constants/posts.paths";

export const updatePostById = async (
  app: Express,
  postId: string,
  postDtoInput: PostInputModel,
) => {
  const updatedPostData = { ...postDto(postDtoInput.blogId), ...postDtoInput };

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(updatedPostData)
    .expect(httpStatuses.NoContent);
};
