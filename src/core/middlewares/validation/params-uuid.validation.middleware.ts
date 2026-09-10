import { param } from "express-validator";

export const uuidParamsValidation = (paramName: string) => {
    return param(paramName)
            .exists()
            .withMessage(`${paramName} is required`)
            .isUUID()
            .withMessage(`Incorrect format of ${paramName}`);
}