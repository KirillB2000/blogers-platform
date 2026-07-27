import { Request, Response, NextFunction } from "express"
import { httpStatuses } from "../types/http-statuses"
import { AppError, BadRequestError } from "./app-errors.exeption"

// Define with app.use() after all routes

export const errorsHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    if (err instanceof AppError) {
        if (err instanceof BadRequestError) {
            return res.status(err.statusCode).json({errorsMessages: err.errorsMessages})
        }

        return res.sendStatus(err.statusCode)
    }

    console.error ('Critical server error: ', err)

    return res.status(httpStatuses.InternalServerError).json({ message: 'Internal Server Error' })
}