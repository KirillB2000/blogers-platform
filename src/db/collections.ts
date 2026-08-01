import { Collection, Db } from "mongodb"
import { Blog } from "../blogs/domain/blog"
import { Post } from "../posts/domain/post"
import { User } from "../users/domain/user"

export const BLOGS_COLLECTION_NAME = 'blogs'
export const POSTS_COLLECTION_NAME = 'posts'
export const USERS_COLLECTION_NAME = 'users'

export let blogsCollection: Collection<Blog>
export let postsCollection: Collection<Post>
export let usersCollection: Collection<User>

export function initCollections(db: Db): void {
    blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME)
    postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME)
    usersCollection = db.collection<User>(USERS_COLLECTION_NAME)
}