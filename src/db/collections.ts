import { Collection, Db } from "mongodb"

import { Blog } from "../modules/blogs/domain/blog"
import { CommentDb } from "../modules/comments/domain/comment"
import { Post } from "../modules/posts/domain/post"
import { IUserDB } from "../modules/users/domain/iUserDb"


export const BLOGS_COLLECTION_NAME = 'blogs'
export const POSTS_COLLECTION_NAME = 'posts'
export const USERS_COLLECTION_NAME = 'users'
export const COMMENTS_COLLECTION_NAME = 'comments'
export const SESSIONS_COLLECTION_NAME = 'sessions'

export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>
export let usersCollection: Collection<IUserDB>
export let commentsCollection: Collection<CommentDb>
export let sessionsCollection: Collection<RefreshTokenDb>

export function initCollections(db: Db): void {
    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)
    usersCollection = db.collection<IUserDB>(USERS_COLLECTION_NAME)
    commentsCollection = db.collection<CommentDb>(COMMENTS_COLLECTION_NAME)
    sessionsCollection = db.collection<RefreshTokenDb>(SESSIONS_COLLECTION_NAME)
} 