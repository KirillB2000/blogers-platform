import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { blogDto } from "./blogDto";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { BLOGS_PATH } from "../../../src/modules/blogs/constants/blogs.paths";
import { blogInputModel } from "../../../src/modules/blogs/api/input/dto/blogInputModel";
import { BlogViewModel } from "../../../src/modules/blogs/api/output/blog-data.output";

export const createBlogDto = async (
  app: Express,
  inputForBlog?: blogInputModel,
): Promise<BlogViewModel> => {
  const testBlogData: blogInputModel = { ...blogDto(), ...inputForBlog };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set("Authorization", generateBasicAuthToken())
    .send(testBlogData)
    .expect(httpStatuses.Created);

  return createdBlogResponse.body;
};
