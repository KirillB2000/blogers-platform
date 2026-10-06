import express from "express";
import setupApp from "../../../src/setup-app";
import request from "supertest";
import { httpStatuses } from "../../../src/core/types/http-statuses";
import { clearDb } from "../../utils/clearDb";
import { generateBasicAuthToken } from "../../utils/generateBasicAuthToken";
import { createBlogDto } from "../../utils/blogs/createBlogDto";
import { createPostDto } from "../../utils/posts/createPostDto";
import { createUserDto } from "../../utils/users/createUserDto";
import { createCommentDto } from "../../utils/comments/createCommentDto";
import { COMMENTS_PATH, COMMENTS_ROUTES } from "../../../src/modules/comments/constants/comments.paths";
import { POSTS_PATH, POSTS_ROUTES } from "../../../src/modules/posts/constants/posts.paths";
import { runDb, stopDb } from "../../../src/db/mongoose.db";
import { PostsModel } from "../../../src/modules/posts/infrastructure/posts.model";
import { UsersModel } from "../../../src/modules/users/infrastructure/users.model";
import { CommentsModel } from "../../../src/modules/comments/infrastructure/comments.model";
import { LikeInputModel } from "../../../src/modules/comments/api/input/dto/likeInputModel";
import { generateTestAccessJwt } from "../../utils/generateJwt";
import { CommentViewModel } from "../../../src/modules/comments/api/output/commentViewModel";
import { LikeStatus } from "../../../src/core/types/likeStatus";

describe("Posts API", () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDb()
  })

  beforeEach(async () => {
    await CommentsModel.deleteMany({})
    await UsersModel.deleteMany({})
    await PostsModel.deleteMany({})
  })

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
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: []
      }
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
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: []
      }
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
      createdAt: expect.any(String),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: []
      }
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

    const { body: comment } = await createCommentDto(app, existedPost.id, existedUser)

    expect(comment).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      commentatorInfo: {
        userId: existedUser.id,
        userLogin: existedUser.login
      },
      createdAt: expect.any(String),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: comment.likesInfo.myStatus
      }
    })

  }),

  it("Should get comments list for specific post; GET /post/:postId/comments", async () => {
    const existedPost = await createPostDto(app)
    const existedUser = await createUserDto(app)
    const { body: comment1 } = await createCommentDto(app, existedPost.id, existedUser)
    const { body: comment2 } = await createCommentDto(app, existedPost.id, existedUser)
    const { body: comment3 } = await createCommentDto(app, existedPost.id, existedUser)
    const userToLike1 = await createUserDto(
      app,
      {
        email: 'UserToLike@example.com',
        login: 'UserToLike',
        password: '123123123123'
      }
    )
    const userToLikeToken1 = generateTestAccessJwt(userToLike1)
    let likeStatusInput: LikeInputModel = {
      likeStatus: LikeStatus.Like
    }
    // Like first comment
    await request(app)
      .put(`${COMMENTS_PATH}/${comment1.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userToLikeToken1}`)
      .send(likeStatusInput)
      .expect(httpStatuses.NoContent)
      // Dislike second comment
    likeStatusInput.likeStatus = LikeStatus.Dislike
    await request(app)
      .put(`${COMMENTS_PATH}/${comment2.id}${COMMENTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userToLikeToken1}`)
      .send(likeStatusInput)
      .expect(httpStatuses.NoContent)
    const response = await request(app)
      .get(`${POSTS_PATH}/${existedPost.id}${COMMENTS_PATH}`)
      .set('Authorization', `Bearer ${userToLikeToken1}`)
      .expect(httpStatuses.Ok)

    const comment1LikeStatus: CommentViewModel = response.body.items.find((comm: CommentViewModel) => comm.id === comment1.id)
    const comment2LikeStatus: CommentViewModel = response.body.items.find((comm: CommentViewModel) => comm.id === comment2.id)
    const comment3LikeStatus: CommentViewModel = response.body.items.find((comm: CommentViewModel) => comm.id === comment3.id)

    expect(comment1LikeStatus.likesInfo.likesCount).toBe(1)
    expect(comment1LikeStatus.likesInfo.myStatus).toBe(LikeStatus.Like)

    expect(comment2LikeStatus.likesInfo.dislikesCount).toBe(1)
    expect(comment2LikeStatus.likesInfo.myStatus).toBe(LikeStatus.Dislike)
    
    expect(comment3LikeStatus.likesInfo.likesCount).toBe(0)
    expect(comment3LikeStatus.likesInfo.dislikesCount).toBe(0)
    expect(comment3LikeStatus.likesInfo.myStatus).toBe(LikeStatus.None)
  })

  it('Should update poost like information; PUT /posts/:postId/like-status', async () => {
    const postToUpdateLikeStatus = await createPostDto(app)
    const userToLike1 = await createUserDto(app)

    const userTolikeToken1 = generateTestAccessJwt(userToLike1)

    let likeStatus: LikeInputModel = {
      likeStatus: LikeStatus.Like
    }

    const postId = postToUpdateLikeStatus.id

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    const responseAfterLike1 = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .expect(httpStatuses.Ok)

    expect(responseAfterLike1.body.extendedLikesInfo.likesCount).toBe(1)
    expect(responseAfterLike1.body.extendedLikesInfo.dislikesCount).toBe(0)
    expect(responseAfterLike1.body.extendedLikesInfo.newestLikes.length).toBe(1)

    likeStatus.likeStatus = LikeStatus.Dislike

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    const responseAfterDislike1 = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .expect(httpStatuses.Ok)
    
    expect(responseAfterDislike1.body.extendedLikesInfo.likesCount).toBe(0)
    expect(responseAfterDislike1.body.extendedLikesInfo.dislikesCount).toBe(1)
    expect(responseAfterDislike1.body.extendedLikesInfo.newestLikes.length).toBe(0)

    likeStatus.likeStatus = LikeStatus.None

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    const responseAfterNone2 = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .expect(httpStatuses.Ok)

    expect(responseAfterNone2.body.extendedLikesInfo.likesCount).toBe(0)
    expect(responseAfterNone2.body.extendedLikesInfo.dislikesCount).toBe(0)
    expect(responseAfterNone2.body.extendedLikesInfo.newestLikes.length).toBe(0)

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    const responseAfterNone3 = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .expect(httpStatuses.Ok)

    expect(responseAfterNone3.body.extendedLikesInfo.likesCount).toBe(0)
    expect(responseAfterNone3.body.extendedLikesInfo.dislikesCount).toBe(0)
    expect(responseAfterNone3.body.extendedLikesInfo.newestLikes.length).toBe(0)

    likeStatus.likeStatus = LikeStatus.Like

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    likeStatus.likeStatus = LikeStatus.None

    await request(app)
      .put(`${POSTS_PATH}/${postId}${POSTS_ROUTES.LIKE_STATUS}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .send(likeStatus)
      .expect(httpStatuses.NoContent)

    const responseAfterNone4 = await request(app)
      .get(`${POSTS_PATH}/${postId}`)
      .set('Authorization', `Bearer ${userTolikeToken1}`)
      .expect(httpStatuses.Ok)

    expect(responseAfterNone4.body.extendedLikesInfo.likesCount).toBe(0)
    expect(responseAfterNone4.body.extendedLikesInfo.dislikesCount).toBe(0)
    expect(responseAfterNone4.body.extendedLikesInfo.newestLikes.length).toBe(0)
  })
});