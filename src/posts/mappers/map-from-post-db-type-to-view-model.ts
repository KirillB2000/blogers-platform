import { WithId } from "mongodb"
import { Post } from "../input/post"
import { PostViewModel } from "../output/post-data.output"

export const mapToPostViewModel = (post: WithId<Post>): PostViewModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}