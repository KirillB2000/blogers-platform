import express from "express";
import request from "supertest";
import setupApp from "../../../src/setup-app";
import { clearDb } from "../../utils/clearDb";
import { blogInputModel } from "../../../src/blogs/dto/blogInputModel";
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { createBlogDto } from "../../utils/blogs/createBlogDto";
import { generateBasicAuthToken } from "../../utils/generateBasicAuthToken";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";

describe("Blogs API body validation check", () => {
  const app = express();
  setupApp(app);

  const correctBlogInputData: blogInputModel = {
    name: "correct name",
    description: "correct description",
    websiteUrl: "https://correctexample.com",
  };

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb()
  })

  it("Should not create blog without authorization", async () => {
    const createdBlog = await request(app)
      .post(BLOGS_PATH)
      .send({
        ...correctBlogInputData,
      })
      .expect(httpStatuses.Unauthorized);

    expect(createdBlog.body).toEqual({});
  });

  it("Should not create blog with incorrect input data", async () => {
    const incorrectBlogBodyInput1 = await request(app)
      .post(BLOGS_PATH)
      .set("Authorization", generateBasicAuthToken())
      .send({
        ...correctBlogInputData,
        name: "    ",
        description: "",
        websiteUrl: "dasfasdf",
      })
      .expect(httpStatuses.BadRequest);

    expect(incorrectBlogBodyInput1.body.errorsMessages).toHaveLength(3);
  });

  it("Should not update blog with incorrect input data", async () => {
    const createdBlog = await createBlogDto(app);
    const incorrectBlogBodyInput1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set("Authorization", generateBasicAuthToken())
      .send({
        ...correctBlogInputData,
        name: "    ",
        description: "",
        websiteUrl: "dasfasdf",
      })
      .expect(httpStatuses.BadRequest);

    expect(incorrectBlogBodyInput1.body.errorsMessages).toHaveLength(3);
  });
});
