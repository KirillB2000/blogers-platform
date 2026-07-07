import { ValidationError, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { httpStatuses } from "../../http-statuses";


const formatErrors = (error: ValidationError) => {
    if (error.type === 'field') {
        return {field: error.path, message: error.msg}
    }

    return { field: '', message: error.msg }
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({onlyFirstError: true})

    if (errors.length > 0) {
        res.status(httpStatuses.BadRequest).json({ errorMesages: errors })
        return;
    }

    next()
}