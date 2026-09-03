import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { POSTS_PATH } from "../../../src/modules/posts/constants/posts.paths";
import { PostViewModel } from "../../../src/modules/posts/api/output/post-data.output";

export const getPostById = async (
  app: Express,
  postId: string,
): Promise<PostViewModel> => {
  const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(httpStatuses.Ok);

  return postResponse.body;
};
