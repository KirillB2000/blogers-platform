import { body } from 'express-validator'

const loginOrEmailValidation = body('loginOrEmail')
    .isString()
    .withMessage("Login or email must be a string")
    .trim()
    .notEmpty()
    .withMessage('Login or email is required and cannot be empty')

const passwordValidation = body('password')
    .isString()
    .withMessage("Password must be a string")
    .trim()
    .notEmpty()
    .withMessage('Password is required and cannot be empty')

export const loginDtoValidation = [
    loginOrEmailValidation,
    passwordValidation
]