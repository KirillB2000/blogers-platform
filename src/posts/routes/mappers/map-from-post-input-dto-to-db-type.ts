import { postInputModel } from "../../dto/postInputModel";
import { Post } from "../../domain/post";


export const mapPostInputDtoToDbType = (
    dto: postInputModel
): Omit<Post, 'createdAt' | 'blogName'> => {
    return {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId
    }
}