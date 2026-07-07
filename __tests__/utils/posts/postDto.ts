import { postInputModel } from "../../../src/posts/dto/postInputModel";

export const postDto = (blogId: string): postInputModel => {
    return {
        title: 'Test title',
        shortDescription: 'Test description',
        content: 'Test content',
        blogId: blogId,
    }
}