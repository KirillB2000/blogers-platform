import { body } from "express-validator";

const loginValidation = body('login')
    .isString()
    .withMessage('Login must be a string')
    .trim()
    .notEmpty()
    .withMessage("Login is required and cannot be empty")
    .isLength({min: 3, max: 10})
    .withMessage('Login is need to be from 3 to 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login contains invalid characters')

const passwordValidation = body('password')
    .isString()
    .withMessage('Password must be a string')
    .trim()
    .notEmpty()
    .withMessage("Password is required and cannot be empty")
    .isLength({ min: 6, max: 20 })
    .withMessage('Login must contains from 6 to 20 characters')

export const emailValidation = body('email')
    .isString()
    .withMessage('Email must be a string')
    .trim()
    .notEmpty()
    .withMessage("Email is required and cannot be empty")
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('Email contains invalid characters')

export const userDtoValidation = [
    loginValidation,
    passwordValidation,
    emailValidation
]