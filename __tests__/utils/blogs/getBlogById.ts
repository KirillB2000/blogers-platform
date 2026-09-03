import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { BLOGS_PATH } from "../../../src/modules/blogs/constants/blogs.paths";
import { BlogViewModel } from "../../../src/modules/blogs/api/output/blog-data.output";

export const getBlogById = async (
  app: Express,
  blogId: string,
): Promise<BlogViewModel> => {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(httpStatuses.Ok);

  return blogResponse.body;
};
