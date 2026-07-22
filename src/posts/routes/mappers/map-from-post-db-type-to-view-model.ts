import { WithId } from "mongodb"
import { Post } from "../../domain/post"
import { postViewModel } from "../output/post-data.output"

export const mapToPostViewModel = (post: WithId<Post>): postViewModel => {
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