import { Express } from "express";
import request from "supertest";
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { blogInputModel } from "../../../src/blogs/dto/blogInputModel";
import { blogDto } from "./blogDto";
import { generateBasicAuthToken } from "../generateBasicAuthToken";

export const updateBlogById = async (
  app: Express,
  postId: string,
  blogDtoInput?: blogInputModel,
) => {
  const updatedBlog: blogInputModel = { ...blogDto(), ...blogDtoInput };

  await request(app)
    .put(`${BLOGS_PATH}/${postId}`)
    .set("Authorization", generateBasicAuthToken())
    .send(updatedBlog)
    .expect(httpStatuses.NoContent);
};
