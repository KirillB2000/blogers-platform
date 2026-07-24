import { param } from "express-validator";

export const idValidation = (paramIdName: string) => {
    return param(paramIdName)
        .exists()
        .withMessage("ID is required")
        .isMongoId()
        .withMessage("Incorrect format of ObjectId");
}