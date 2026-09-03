import { PostInputModel } from "../api/input/dto/postInputModel";
import { Post } from "../domain/post";


export const mapPostInputDtoToDbType = (
    dto: PostInputModel
): Omit<Post, 'createdAt' | 'blogName'> => {
    return {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId
    }
}