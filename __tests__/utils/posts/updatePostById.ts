import { Express } from "express";
import request from "supertest";
import { postInputModel } from "../../../src/posts/dto/postInputModel";
import { postDto } from "./postDto";
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generateBasicAuthToken";

export const updatePostById = async (
  app: Express,
  postId: string,
  postDtoInput: postInputModel,
) => {
  const updatedPostData = { ...postDto(postDtoInput.blogId), ...postDtoInput };

  await request(app)
    .put(`${POSTS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(updatedPostData)
    .expect(httpStatuses.NoContent);
};
