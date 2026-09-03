import { Express } from "express";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { blogDto } from "./blogDto";
import { generateBasicAuthToken } from "../generateBasicAuthToken";
import { BLOGS_PATH } from "../../../src/modules/blogs/constants/blogs.paths";
import { blogInputModel } from "../../../src/modules/blogs/api/input/dto/blogInputModel";

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
