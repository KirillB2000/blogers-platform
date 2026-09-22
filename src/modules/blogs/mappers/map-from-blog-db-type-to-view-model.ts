import { BlogViewModel } from "../api/output/blog-data.output";
import { BlogsDocument } from "../infrastructure/blogs.model";



export const mapToBlogViewModel = (blog: BlogsDocument): BlogViewModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
} 