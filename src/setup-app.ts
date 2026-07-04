import express, { Express } from 'express';
import { blogsRouter } from './blogs/routers/blogs.routers';
import { postsRouter } from './posts/routers/posts.router';
import { BLOGS_PATH } from './blogs/constants/blogs.paths';
import { POSTS_PATH } from './posts/constants/posts.paths';

export const setupApp = (app: Express) => {
    app.use(express.json())

    app.use(BLOGS_PATH, blogsRouter)
    app.use(POSTS_PATH, postsRouter)

    return app;
}