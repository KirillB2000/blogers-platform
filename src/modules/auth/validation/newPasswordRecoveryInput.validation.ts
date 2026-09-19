import { body } from "express-validator";

export const newPasswordValidation = body('newPassword')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .notEmpty()
    .withMessage("Password is required and cannot be empty")
    .isLength({ min: 6, max: 20 })
    .withMessage('Login must contains from 6 to 20 characters')

export const recoveryCodeDtoValidation = body('recoveryCode')
    .isString()
    .withMessage('Code is must be a string')
    .trim()
    .notEmpty()
    .withMessage('Code is required and cannot be empty')

export const newPasswordRecoveryInputValidation = [
    newPasswordValidation,
    recoveryCodeDtoValidation
]