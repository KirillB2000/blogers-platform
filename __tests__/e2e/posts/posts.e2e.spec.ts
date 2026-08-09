import express from "express";
import setupApp from "../../../src/setup-app";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { POSTS_PATH, POSTS_ROUTES } from "../../../src/posts/constants/posts.paths";
import { clearDb } from "../../utils/clearDb";
import { generateBasicAuthToken } from "../../utils/generateBasicAuthToken";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import { createBlogDto } from "../../utils/blogs/createBlogDto";
import { createPostDto } from "../../utils/posts/createPostDto";
import { createUserDto } from "../../utils/users/createUserDto";
import { COMMENTS_PATH } from "../../../src/comments/constants/comments.paths";
import { createCommentDto } from "../../utils/comments/createCommentDto";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

 beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb()
  })

  it("Should create new post; POST /api/posts", async () => {
    const blog = await createBlogDto(app);

    const response = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "Test title",
        shortDescription: "Test description",
        content: "Test content",
        blogId: blog.id,
      })
      .expect(httpStatuses.Created);

    expect(response.body).toEqual({
      id: expect.any(String),
      title: "Test title",
      shortDescription: "Test description",
      content: "Test content",
      blogId: blog.id,
      blogName: blog.name,
      createdAt: expect.any(String)
    });
  });

  it("Should get post list with pagination; GET /api/posts", async () => {
    await clearDb(app);

    // Создаем блог и 4 поста для проверки пагинации напрямую через API
    const blog = await createBlogDto(app);
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post(POSTS_PATH)
        .set("Authorization", adminToken)
        .send({ title: `Test post ${i}`, shortDescription: "desc", content: "content", blogId: blog.id })
        .expect(httpStatuses.Created);
    }

    // Проверяем пагинацию: pageSize=2, pageNumber=1
    const response = await request(app)
      .get(`${POSTS_PATH}?pageNumber=1&pageSize=2`)
      .expect(httpStatuses.Ok);

    expect(response.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: 1,
      pageSize: 2,
      totalCount: expect.any(Number),
      items: expect.any(Array)
    });
    expect(response.body.items.length).toBe(2);
    expect(response.body.totalCount).toBeGreaterThanOrEqual(1);
    expect(response.body.pagesCount).toBeGreaterThanOrEqual(1);

    // Проверяем сортировку по title по возрастанию
    await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ title: "A title", shortDescription: "desc", content: "content", blogId: blog.id })
      .expect(httpStatuses.Created);

    await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({ title: "B title", shortDescription: "desc", content: "content", blogId: blog.id })
      .expect(httpStatuses.Created);

    const responseSorted = await request(app)
      .get(`${POSTS_PATH}?sortBy=title&sortDirection=asc`)
      .expect(httpStatuses.Ok);

    // Проверяем что сортировка работает — "A title" должен быть раньше "B title"
    const titles = responseSorted.body.items.map((item: any) => item.title);
    const indexA = titles.indexOf("A title");
    const indexB = titles.indexOf("B title");
    expect(indexA).toBeLessThan(indexB);
  });

  it("Should get post by id; GET /api/posts/:id", async () => {
    const blog = await createBlogDto(app);

    const createResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "Test title",
        shortDescription: "Test description",
        content: "Test content",
        blogId: blog.id,
      })
      .expect(httpStatuses.Created);

    const postByIdResponse = await request(app)
      .get(`${POSTS_PATH}/${createResponse.body.id}`)
      .expect(httpStatuses.Ok);

    expect(postByIdResponse.body).toEqual({
      id: expect.any(String),
      title: "Test title",
      shortDescription: "Test description",
      content: "Test content",
      blogId: blog.id,
      blogName: blog.name,
      createdAt: expect.any(String)
    });
  });

  it("Should return 404 for non-existent post id; GET /api/posts/:id", async () => {
    const fakeId = "000000000000000000000000"; // валидный ObjectId, но несуществующий

    await request(app)
      .get(`${POSTS_PATH}/${fakeId}`)
      .expect(httpStatuses.NotFound);
  });

  it("Should return 400 for invalid post id format; GET /api/posts/:id", async () => {
    await request(app)
      .get(`${POSTS_PATH}/invalid-id`)
      .expect(httpStatuses.BadRequest);
  });

  it("Should update post by id; PUT /api/post/:id", async () => {
    const blog1 = await createBlogDto(app);
    const blog2 = await createBlogDto(app);

    const createResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "Original title",
        shortDescription: "Original description",
        content: "Original content",
        blogId: blog1.id,
      })
      .expect(httpStatuses.Created);

    const updatedData = {
      title: "Updated title2",
      shortDescription: "Updated description2",
      content: "Updated content2",
      blogId: blog2.id,
    };

    await request(app)
      .put(`${POSTS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .send(updatedData)
      .expect(httpStatuses.NoContent);

    const updatedPostResponse = await request(app)
      .get(`${POSTS_PATH}/${createResponse.body.id}`)
      .expect(httpStatuses.Ok);

    expect(updatedPostResponse.body).toEqual({
      id: createResponse.body.id,
      title: updatedData.title,
      shortDescription: updatedData.shortDescription,
      content: updatedData.content,
      blogId: blog2.id,
      blogName: blog2.name,
      createdAt: expect.any(String)
    });
  });

  it("Should delete post by id; DELETE /api/post/:id", async () => {
    const blog = await createBlogDto(app);

    const createResponse = await request(app)
      .post(POSTS_PATH)
      .set("Authorization", adminToken)
      .send({
        title: "Test title",
        shortDescription: "Test description",
        content: "Test content",
        blogId: blog.id,
      })
      .expect(httpStatuses.Created);

    await request(app)
      .delete(`${POSTS_PATH}/${createResponse.body.id}`)
      .set("Authorization", adminToken)
      .expect(httpStatuses.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createResponse.body.id}`)
      .expect(httpStatuses.NotFound);
  });

  it("Should create comment for specific post; POST /post/:postId/comments", async () => {
    const existedPost = await createPostDto(app)
    const existedUser = await createUserDto(app)

    const comment = await createCommentDto(app, existedPost.id, existedUser)

    expect(comment).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: existedUser.id,
        userLogin: existedUser.login
      },
      createdAt: expect.any(String)
    })

  })
});