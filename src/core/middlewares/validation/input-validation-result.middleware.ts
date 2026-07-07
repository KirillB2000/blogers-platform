import { ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { httpStatuses } from "../../types/http-statuses";
import { ApiErrorResult, FieldError } from "../../types/errors";


const formatErrors = (error: ValidationError): FieldError => {
    if (error.type === 'field') {
        return {field: error.path, message: error.msg}
    }

    return { field: null, message: error.msg }
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response<ApiErrorResult>,
    next: NextFunction,
) => {
    const errors: FieldError[] = validationResult(req)
        .formatWith(formatErrors)
        .array({onlyFirstError: true})

    if (errors.length > 0) {
        res.status(httpStatuses.BadRequest).json({ errorsMessages: errors })
        return;
    }

    next()
}