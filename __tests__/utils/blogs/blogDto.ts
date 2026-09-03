import { blogInputModel } from "../../../src/modules/blogs/api/input/dto/blogInputModel";

export const blogDto = (): blogInputModel => {
  return {
    name: "Test name",
    description: "Test description",
    websiteUrl: "https://example.com",
  };
};
