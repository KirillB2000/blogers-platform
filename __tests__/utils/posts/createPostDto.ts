import { Express } from "express";
import { PostInputModel } from "../../../src/posts/input/dto/postInputModel";
import { createBlogDto } from "../blogs/createBlogDto";
import { postDto } from "./postDto";
import request from "supertest";
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { PostViewModel } from "../../../src/posts/output/post-data.output";
import { generateBasicAuthToken } from "../generateBasicAuthToken";

export const createPostDto = async (
  app: Express,
  inputForPost?: PostInputModel,
): Promise<PostViewModel> => {
  const blog = await createBlogDto(app);

  const testPostData = { ...postDto(blog.id), ...inputForPost };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testPostData)
    .expect(httpStatuses.Created);

  return createdPostResponse.body;
};
