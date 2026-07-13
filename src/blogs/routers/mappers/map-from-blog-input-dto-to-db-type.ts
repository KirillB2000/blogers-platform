import { blogInputModel } from "../../dto/blogInputModel";
import { Blog } from "../../types/blog";


export const  mapBlogInputDtoToDbType = (
    dto: blogInputModel
    ): Omit<Blog, 'createdAt' | 'isMembership'> => {
        return {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }
}