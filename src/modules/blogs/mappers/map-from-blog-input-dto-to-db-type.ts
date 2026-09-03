import { blogInputModel } from "../api/input/dto/blogInputModel"
import { Blog } from "../domain/blog"



export const  mapBlogInputDtoToDbType = (
    dto: blogInputModel
    ): Omit<Blog, 'createdAt' | 'isMembership'> => {
        return {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }
}