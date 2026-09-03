import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { POSTS_PATH } from "../../../src/modules/posts/constants/posts.paths";
import { PostInputModel } from "../../../src/modules/posts/api/input/dto/postInputModel";
import { PostViewModel } from "../../../src/modules/posts/api/output/post-data.output";
import { createBlogDto } from "../blogs/createBlogDto";
import { postDto } from "./postDto";

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
