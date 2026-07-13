import { postInputModel } from "../../dto/postInputModel";
import { Post } from "../../types/post";


export const mapPostInputDtoToDbType = (
    dto: postInputModel
): Omit<Post, 'createdAt' | 'blogName'> => {
    return {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.shortDescription,
        blogId: dto.blogId
    }
}