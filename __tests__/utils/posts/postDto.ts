import { PostInputModel } from "../../../src/posts/input/dto/postInputModel";

export const postDto = (blogId: string): PostInputModel => {
  return {
    title: "Test title",
    shortDescription: "Test description",
    content: "Test content",
    blogId: blogId,
  };
};
