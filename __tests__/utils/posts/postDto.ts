import { PostInputModel } from "../../../src/modules/posts/api/input/dto/postInputModel";

export const postDto = (blogId: string): PostInputModel => {
  return {
    title: "Test title",
    shortDescription: "Test description",
    content: "Test content",
    blogId: blogId,
  };
};
