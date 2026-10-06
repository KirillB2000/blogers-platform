import { body } from "express-validator";
import { LikeStatus } from "../../../core/types/likeStatus";

export const likeStatusValidation = body('likeStatus')
    .isString()
    .withMessage("Like status must be a string")
    .trim()
    .notEmpty()
    .withMessage("Like status is required and cannot be empty")
    .isIn(Object.values(LikeStatus))
    .withMessage('Invalid like status')