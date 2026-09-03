import { WithId } from "mongodb";
import { BlogViewModel } from "../api/output/blog-data.output";
import { Blog } from "../domain/blog";



export const mapToBlogViewModel = (blog: WithId<Blog>): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
} 