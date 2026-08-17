import { Collection, Db } from "mongodb"
import { Blog } from "../blogs/domain/blog"
import { Post } from "../posts/input/post"
import { PComment } from "../comments/input/comment"
import { IUserDB } from "../users/input/domain/iUserDb"


export const BLOGS_COLLECTION_NAME = 'blogs'
export const POSTS_COLLECTION_NAME = 'posts'
export const USERS_COLLECTION_NAME = 'users'
export const COMMENTS_COLLECTION_NAME = 'comments'

export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>
export let usersCollection: Collection<IUserDB>
export let commentsCollection: Collection<PComment>

export function initCollections(db: Db): void {
    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)
    usersCollection = db.collection<IUserDB>(USERS_COLLECTION_NAME)
    commentsCollection = db.collection<PComment>(COMMENTS_COLLECTION_NAME)
} 