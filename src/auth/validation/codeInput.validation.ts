import { body } from "express-validator"

const codeValidation = body('code')
    .isString()
    .withMessage('Code is must be a string')
    .trim()
    .notEmpty()
    .withMessage('Code is required and cannot be empty')

export const codeDtoValidation = [
    codeValidation
]