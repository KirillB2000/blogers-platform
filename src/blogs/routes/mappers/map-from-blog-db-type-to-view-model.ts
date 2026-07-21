import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogViewModel } from "../output/blog-data.output";


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