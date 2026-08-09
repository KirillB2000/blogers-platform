import { PostInputModel } from "../input/dto/postInputModel";
import { Post } from "../input/post";


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