"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogInputDtoValidation = void 0;
const express_validator_1 = require("express-validator");
const nameValidation = (0, express_validator_1.body)("name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required and cannot be empty")
    .isLength({ max: 15 })
    .withMessage("Name is too long");
const descriptionValidation = (0, express_validator_1.body)("description")
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Description is required and cannot be empty")
    .isLength({ max: 500 })
    .withMessage("Description is too long");
const websiteValidation = (0, express_validator_1.body)("websiteUrl")
    .isString()
    .withMessage("WebsiteUrl must be a string")
    .trim()
    .notEmpty()
    .withMessage("WebsiteUrl is required and cannot be empty")
    .isLength({ max: 100 })
    .withMessage("WebsiteUrl is too long")
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    .withMessage("WebsiteUrl must match the required pattern");
exports.blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteValidation,
];
