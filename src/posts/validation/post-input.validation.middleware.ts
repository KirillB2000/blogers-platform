import { body } from "express-validator";
import { blogsRepository } from "../../blogs/repositories/blogs.repository";

const titleValidation = body("title")
  .isString()
  .withMessage("Title must be a string")
  .trim()
  .notEmpty()
  .withMessage("Title is required and cannot be empty")
  .isLength({ max: 30 })
  .withMessage("Title is too long");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .withMessage("Short description must be a string")
  .trim()
  .notEmpty()
  .withMessage("Short description is required and cannot be empty")
  .isLength({ max: 100 })
  .withMessage("Short description is too long");

const content = body("content")
  .isString()
  .withMessage("Content must be a string")
  .trim()
  .notEmpty()
  .withMessage("Content is required and cannot be empty")
  .isLength({ max: 1000 })
  .withMessage("Content is too long");

const blogId = body("blogId")
  .isString()
  .withMessage("Blog id must be a string")
  .trim()
  .notEmpty()
  .withMessage("Blog id is required and cannot be empty")
  .isMongoId()
  .custom(async (value) => {
    const existedBlog = await blogsRepository.findById(value);

    if (!existedBlog) {
      throw new Error("Blog should exist");
    }

    return true;
  });

export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  content,
  blogId,
];
