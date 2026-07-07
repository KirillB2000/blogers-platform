import { body } from "express-validator";

const nameValidation = body('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .notEmpty().withMessage('Name is required and cannot be empty')
    .isLength({max: 15}).withMessage('Name is too long')

const descriptionValidation = body('description')
    .isString().withMessage('Description must be a string')
    .trim()
    .notEmpty().withMessage('Description is required and cannot be empty')
    .isLength({max: 500}).withMessage('Description is too long')

const websiteValidation = body('websiteUrl')
    .isString().withMessage('WebsiteUrl must be a string')
    .trim()
    .notEmpty().withMessage('WebsiteUrl is required and cannot be empty')
    .isLength({max: 100}).withMessage('WebsiteUrl is too long')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage('WebsiteUrl must match the required pattern')

export const blogInputDtoValidation = [
    nameValidation,
    descriptionValidation,
    websiteValidation
]