import express from 'express'
import setupApp from '../../../src/setup-app'
import request from 'supertest'
import { TESTING_PATH, TESTING_ROUTES } from '../../../src/testing/constants/testing.paths';
import { httpStatuses } from '../../../src/core/types/http-statuses';
import { createPostDto } from '../../utils/posts/createPostDto';
import { postViewModel } from '../../../src/posts/types/postViewModel';
import { POSTS_PATH } from '../../../src/posts/constants/posts.paths';
import { getPostById } from '../../utils/posts/getPostByID';
import { postDto } from '../../utils/posts/postDto';
import { createBlogDto } from '../../utils/blogs/createBlogDto';
import { updatePostById } from '../../utils/posts/updatePostById';
import { postInputModel } from '../../../src/posts/dto/postInputModel';

describe ('Posts API', () => {
    const app = express()
    setupApp(app)

    beforeAll(async () => {
       await request(app)
        .delete(`${TESTING_PATH}${TESTING_ROUTES.ALL_DATA}`)
        .expect(httpStatuses.NoContent)
    })

    it('Should create new post; POST /api/posts', async () => {
        const createdPost: postViewModel = await createPostDto(app)
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'Test title',
            shortDescription: 'Test description',
            content: 'Test content',
            blogId: expect.any(String),
            blogName: expect.any(String)
        })
    })

    it('Should get post list; GET /api/posts', async () => {
        await createPostDto(app)
        await createPostDto(app)

        const response = await request(app)
                    .get(POSTS_PATH)
                    .expect(httpStatuses.Ok)
        
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(2)
    })

    it('Shold get post by id; GET /api/posts/:id', async() => {
        const createdPost = await createPostDto(app)
        const postById = await getPostById(app, createdPost.id)

        expect(postById).toEqual({
            id: expect.any(String),
            title: 'Test title',
            shortDescription: 'Test description',
            content: 'Test content',
            blogId: expect.any(String),
            blogName: expect.any(String)
        })
    })

    it('Should update post by id; PUT /api/post/:id', async ()  => {
        const createdPost = await createPostDto(app)
        const createBlog = await createBlogDto(app)

        const postDataDtoForChange: postInputModel = {
            title: 'Updated title2',
            shortDescription: 'Updated description2',
            content: 'Updated content2',
            blogId: createBlog.id,
        }

        await updatePostById(app, createdPost.id, postDataDtoForChange)

        const updatedPost = await getPostById(app, createdPost.id)

        expect(updatedPost).toEqual({
                id: createdPost.id,
                title: postDataDtoForChange.title,
                shortDescription: postDataDtoForChange.shortDescription,
                content: postDataDtoForChange.content,
                blogId: createBlog.id,
                blogName: createBlog.name
        })
    })

    it('Should delete post by id; DELETE /api/post/:id', async () => {
        const existedPost = await createPostDto(app);

        await request(app)
            .delete(`${POSTS_PATH}/${existedPost.id}`)
            .expect(httpStatuses.NoContent)

        await request(app)
            .get(`${POSTS_PATH}/${existedPost.id}`)
            .expect(httpStatuses.NotFound)
    })
})