import { postBlogInputModel } from "../../../src/posts/dto/postBlogInputModel";

export const postForBlogDto = (blogId: string): postBlogInputModel => {
  return {
    title: "Test title",
    shortDescription: "Test description",
    content: "Test content",
  };
};
