import { PostViewModel } from "../api/output/post-data.output"
import { PostsDocument } from "../infrastructure/posts.model"

export const mapToPostViewModel = (post: PostsDocument): PostViewModel => {
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