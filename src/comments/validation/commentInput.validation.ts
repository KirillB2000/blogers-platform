import { body } from 'express-validator'

const contentValidation = body('content')
    .isString()
    .withMessage("Content must be a string")
    .trim()
    .notEmpty()
    .withMessage("Content is required and cannot be empty")
    .isLength({ min: 20, max: 300 })
    .withMessage("Content must be between 20 and 300 characters");

export const commentInputDtoValidation = [
    contentValidation
]