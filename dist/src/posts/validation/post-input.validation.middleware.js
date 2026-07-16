"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../../blogs/repositories/blogs.repository");
const titleValidation = (0, express_validator_1.body)("title")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Title is required and cannot be empty")
    .isLength({ max: 30 })
    .withMessage("Title is too long");
const shortDescriptionValidation = (0, express_validator_1.body)("shortDescription")
    .isString()
    .withMessage("Short description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Short description is required and cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Short description is too long");
const content = (0, express_validator_1.body)("content")
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required and cannot be empty")
    .isLength({ max: 1000 })
    .withMessage("Content is too long");
const blogId = (0, express_validator_1.body)("blogId")
    .isString()
    .withMessage("Blog id must be a string")
    .trim()
    .notEmpty()
    .withMessage("Blog id is required and cannot be empty")
    .isMongoId()
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const existedBlog = yield blogs_repository_1.blogsRepository.findById(value);
    if (!existedBlog) {
        throw new Error("Blog should exist");
    }
    return true;
}));
exports.postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    content,
    blogId,
];
