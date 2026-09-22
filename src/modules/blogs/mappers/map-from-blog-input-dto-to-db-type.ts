import { blogInputModel } from "../api/input/dto/blogInputModel"
import { BlogsDocument } from "../infrastructure/blogs.model"


export const  mapBlogInputDtoToDbType = (
    dto: blogInputModel
): Pick<BlogsDocument, 'name' | 'description' | 'websiteUrl'> => {
        return {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }
}