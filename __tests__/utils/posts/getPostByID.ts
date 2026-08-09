import { Express } from "express";
import request from "supertest";
import { PostViewModel } from "../../../src/posts/output/post-data.output";
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";

export const getPostById = async (
  app: Express,
  postId: string,
): Promise<PostViewModel> => {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(httpStatuses.Ok);

  return postResponse.body;
};
