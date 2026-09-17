import { body } from "express-validator"

export const codeDtoValidation = (codeName: string) => {
    return body(`${codeName}`)
        .isString()
        .withMessage('Code is must be a string')
        .trim()
        .notEmpty()
        .withMessage('Code is required and cannot be empty')
}