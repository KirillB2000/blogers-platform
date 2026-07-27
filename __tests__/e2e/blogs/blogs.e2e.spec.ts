import express from "express";
import setupApp from "../../../src/setup-app";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { blogInputModel } from "../../../src/blogs/dto/blogInputModel";
import { BLOGS_PATH } from "../../../src/blogs/constants/blogs.paths";
import { blogDto } from "../../utils/blogs/blogDto";
import { createBlogDto } from "../../utils/blogs/createBlogDto";
import { clearDb } from "../../utils/clearDb";
import { generateBasicAuthToken } from "../../utils/generateBasicAuthToken";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/settings/config";
import { POSTS_PATH } from "../../../src/posts/constants/posts.paths";
import { postBlogInputModel } from "../../../src/posts/dto/postBlogInputModel";

describe("Blogs API", () => {
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

  it("Should create new blog; POST /api/blogs", async () => {
    const newBlogDto: blogInputModel = {
      ...blogDto(),
      name: "Test name2",
      description: "Test description2",
      websiteUrl: "https://example2.com",
    };

    const createdBlog = await createBlogDto(app, newBlogDto);

    expect(createdBlog).toEqual({
      id: expect.any(String),
      name: "Test name2",
      description: "Test description2",
      websiteUrl: expect.stringMatching(
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
      ),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });
  });

  it("Should get blog list with pagination; GET /api/blogs", async () => {
    await clearDb(app);

    // Создаем 5 блогов для проверки пагинации
    for (let i = 0; i < 5; i++) {
      await createBlogDto(app, {
        name: `Blog ${i}`,
        description: `Description ${i}`,
        websiteUrl: "https://example.com",
      });
    }

    // Проверяем пагинацию: pageSize=2, pageNumber=1
    const response = await request(app)
      .get(`${BLOGS_PATH}?pageNumber=1&pageSize=2`)
      .expect(httpStatuses.Ok);

    // Проверяем структуру пагинированного ответа
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

    // Проверяем сортировку по name по возрастанию
    const responseSorted = await request(app)
      .get(`${BLOGS_PATH}?sortBy=name&sortDirection=asc&pageSize=10`)
      .expect(httpStatuses.Ok);

    // Проверяем что сортировка работает — элементы идут в алфавитном порядке
    const names = responseSorted.body.items.map((item: any) => item.name);
    for (let i = 1; i < names.length; i++) {
      expect(names[i - 1].localeCompare(names[i])).toBeLessThanOrEqual(0);
    }
  });

  it("Should get blog by id; GET /api/blogs/:id", async () => {
    const createdBlog = await createBlogDto(app);

    const blogByIdResponse = await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(httpStatuses.Ok);

    expect(blogByIdResponse.body).toEqual({
      id: expect.any(String),
      name: "Test name",
      description: "Test description",
      websiteUrl: expect.stringMatching(
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
      ),
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });
  });

  it("Should return 404 for non-existent blog id; GET /api/blogs/:id", async () => {
    const fakeId = "000000000000000000000000"; // валидный ObjectId, но несуществующий

    await request(app)
      .get(`${BLOGS_PATH}/${fakeId}`)
      .expect(httpStatuses.NotFound);
  });

  it("Should return 400 for invalid blog id format; GET /api/blogs/:id", async () => {
    await request(app)
      .get(`${BLOGS_PATH}/invalid-id`)
      .expect(httpStatuses.BadRequest);
  });

  it("Should update blog by id; PUT /api/blogs/:id", async () => {
    const createdBlog = await createBlogDto(app);

    const updateBlogDto = {
      ...blogDto(),
      name: "Updated name",
      description: "Updated description",
      websiteUrl: "https://updatedexample2.com",
    };

    await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set("Authorization", adminToken)
      .send(updateBlogDto)
      .expect(httpStatuses.NoContent);

    const updatedBlogResponse = await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .expect(httpStatuses.Ok);

    expect(updatedBlogResponse.body).toEqual({
      id: expect.any(String),
      name: updateBlogDto.name,
      description: updateBlogDto.description,
      websiteUrl: updateBlogDto.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean)
    });
  });

  it("Should delete blog by id; DELETE /api/blogs/:id", async () => {
    const existedBlog = await createBlogDto(app);

    // Создаем посты для этого блога
    const post1Response = await request(app)
      .post(`${BLOGS_PATH}/${existedBlog.id}${POSTS_PATH}`)
      .set("Authorization", adminToken)
      .send({ title: 'Some title', shortDescription: 'Some description', content: 'Some content' })
      .expect(httpStatuses.Created);

    const post2Response = await request(app)
      .post(`${BLOGS_PATH}/${existedBlog.id}${POSTS_PATH}`)
      .set("Authorization", adminToken)
      .send({ title: 'Some title2', shortDescription: 'Some description2', content: 'Some content2' })
      .expect(httpStatuses.Created);

    await request(app)
      .delete(`${BLOGS_PATH}/${existedBlog.id}`)
      .set("Authorization", adminToken)
      .expect(httpStatuses.NoContent);

    await request(app)
      .get(`${BLOGS_PATH}/${existedBlog.id}`)
      .expect(httpStatuses.NotFound);

    await request(app)
      .get(`${POSTS_PATH}/${post1Response.body.id}`)
      .expect(httpStatuses.NotFound)

    await request(app)
      .get(`${POSTS_PATH}/${post2Response.body.id}`)
      .expect(httpStatuses.NotFound)
  });

  // ===== Новые тесты для эндпоинтов постов конкретного блога =====

  it("Should create post for specific blog; POST /api/blogs/:blogId/posts", async () => {
    const blog = await createBlogDto(app);

    const postData: postBlogInputModel = {
      title: "Blog post title",
      shortDescription: "Blog post description",
      content: "Blog post content",
    };

    const response = await request(app)
      .post(`${BLOGS_PATH}/${blog.id}${POSTS_PATH}`)
      .set("Authorization", adminToken)
      .send(postData)
      .expect(httpStatuses.Created);

    expect(response.body).toEqual({
      id: expect.any(String),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: blog.id,
      blogName: blog.name,
      createdAt: expect.any(String),
    });
  });

  it("Should return 400 when creating post for non-existent blog; POST /api/blogs/:blogId/posts", async () => {
    const fakeId = "000000000000000000000000";

    const postData: postBlogInputModel = {
      title: "Blog post title",
      shortDescription: "Blog post description",
      content: "Blog post content",
    };

    await request(app)
      .post(`${BLOGS_PATH}/${fakeId}${POSTS_PATH}`)
      .set("Authorization", adminToken)
      .send(postData)
      .expect(httpStatuses.BadRequest);
  });

  it("Should return 400 for invalid blogId format when creating post; POST /api/blogs/:blogId/posts", async () => {
    const postData: postBlogInputModel = {
      title: "Blog post title",
      shortDescription: "Blog post description",
      content: "Blog post content",
    };

    await request(app)
      .post(`${BLOGS_PATH}/invalid-id${POSTS_PATH}`)
      .set("Authorization", adminToken)
      .send(postData)
      .expect(httpStatuses.BadRequest);
  });

  it("Should return 401 when creating post without auth; POST /api/blogs/:blogId/posts", async () => {
    const blog = await createBlogDto(app);

    const postData: postBlogInputModel = {
      title: "Blog post title",
      shortDescription: "Blog post description",
      content: "Blog post content",
    };

    await request(app)
      .post(`${BLOGS_PATH}/${blog.id}${POSTS_PATH}`)
      .send(postData)
      .expect(httpStatuses.Unauthorized);
  });

  it("Should get posts for specific blog with pagination; GET /api/blogs/:blogId/posts", async () => {
    await clearDb(app);
    const blog = await createBlogDto(app);

    // Создаем 3 поста для этого блога
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post(`${BLOGS_PATH}/${blog.id}${POSTS_PATH}`)
        .set("Authorization", adminToken)
        .send({
          title: `Blog post ${i}`,
          shortDescription: `Description ${i}`,
          content: `Content ${i}`,
        })
        .expect(httpStatuses.Created);
    }

    const response = await request(app)
      .get(`${BLOGS_PATH}/${blog.id}${POSTS_PATH}?pageNumber=1&pageSize=2`)
      .expect(httpStatuses.Ok);

    // Проверяем структуру пагинированного ответа
    expect(response.body).toMatchObject({
      pagesCount: expect.any(Number),
      page: 1,
      pageSize: 2,
      totalCount: expect.any(Number),
      items: expect.any(Array)
    });
    expect(response.body.items.length).toBe(2);
    expect(response.body.totalCount).toBe(3);
    expect(response.body.pagesCount).toBe(2);

    // Проверяем, что все посты принадлежат нужному блогу
    response.body.items.forEach((post: any) => {
      expect(post.blogId).toBe(blog.id);
    });
  });

  it("Should return 404 when getting posts for non-existent blog; GET /api/blogs/:blogId/posts", async () => {
    const fakeId = "000000000000000000000000";

    await request(app)
      .get(`${BLOGS_PATH}/${fakeId}${POSTS_PATH}`)
      .expect(httpStatuses.NotFound);
  });

  it("Should return 400 for invalid blogId format when getting posts; GET /api/blogs/:blogId/posts", async () => {
    await request(app)
      .get(`${BLOGS_PATH}/invalid-id${POSTS_PATH}`)
      .expect(httpStatuses.BadRequest);
  });
});