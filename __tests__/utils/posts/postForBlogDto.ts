import { PostBlogInputModel } from "../../../src/posts/input/dto/postBlogInputModel";

export const postForBlogDto = (blogId: string): PostBlogInputModel => {
  return {
    title: "Test title",
    shortDescription: "Test description",
    content: "Test content",
  };
};
