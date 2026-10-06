import { PostInputModel } from "../api/input/dto/postInputModel";
import { PostsType } from "../infrastructure/posts.model";


export const mapPostInputDtoToDbType = (
    dto: PostInputModel
): Omit<PostsType, 'createdAt' | 'blogName' | 'extendedLikesInfo'> => {
    return {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId
    }
}