import express from "express";
import request from "supertest";
import setupApp from "../../../src/setup-app";
import { clearDb } from "../../utils/clearDb";
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { generateBasicAuthToken } from "../../utils/generateBasicAuthToken";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import { blogDto } from "../../utils/blogs/blogDto";
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths";

describe("Posts API body validation check", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  let validBlogId: string;

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app);

    // Создаем блог напрямую через API для получения валидного blogId
    const blogResponse = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", adminToken)
      .send(blogDto())
      .expect(httpStatuses.Created);

    validBlogId = blogResponse.body.id;
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb()
  })

  it("Should not create post without authorization", async () => {
    const createdPost = await request(app)
      .post(POSTS_PATH)
      .send({
        title: "Correct title",
        shortDescription: "Correct description",
        content: "Correct content",
        blogId: validBlogId,
      })
      .expect(httpStatuses.Unauthorized);

    expect(createdPost.body).toEqual({});
  });

  it("Should not create post with incorrect input data", async () => {
    const incorrectPostBodyInput = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "   ",
        shortDescription: 12,
        content: "",
        blogId: "123",
      })
      .expect(httpStatuses.BadRequest);

    expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4);
  });

  it("Should not update post with incorrect input data", async () => {
    // Создаем пост напрямую через API
    const createResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "Correct title",
        shortDescription: "Correct description",
        content: "Correct content",
        blogId: validBlogId,
      })
      .expect(httpStatuses.Created);

    const incorrectPostBodyInput = await request(app)
      .put(`${POSTS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .send({
        title: "   ",
        shortDescription: 12,
        content: "",
        blogId: "123",
      })
      .expect(httpStatuses.BadRequest);

    expect(incorrectPostBodyInput.body.errorsMessages).toHaveLength(4);
  });
});