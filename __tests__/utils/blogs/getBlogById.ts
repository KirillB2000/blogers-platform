import { Express } from "express";
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { BlogDataOutput } from "../../../src/blogs/routes/output/bloger-data.output";

export const getBlogById = async (
  app: Express,
  blogId: string,
): Promise<BlogDataOutput> => {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(httpStatuses.Ok);

  return blogResponse.body;
};
