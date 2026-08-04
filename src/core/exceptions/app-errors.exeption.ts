import { FieldError } from "../types/errors"
import { httpStatuses } from "../types/http-statuses"

export abstract class AppError extends Error {
    abstract readonly statusCode: number

    constructor (message: string) {
        super(message)

        Object.setPrototypeOf(this, new.target.prototype)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export class NotFoundError extends AppError {
    readonly statusCode = httpStatuses.NotFound
    constructor (message: string) {
        super(message)
    }
}

export class BadRequestError extends AppError {
    readonly statusCode = httpStatuses.BadRequest
    public readonly errorsMessages: FieldError[]

    constructor (messageOrErrors: string | FieldError[]) {
        const message = typeof messageOrErrors === 'string' ? messageOrErrors : 'Validation failed'
        super(message);

        if (Array.isArray(messageOrErrors)) {
            this.errorsMessages = messageOrErrors
        } else {
            this.errorsMessages = [{field: null, message: messageOrErrors}]
        }
    }
}
export class UnauthorizedError extends AppError {
    readonly statusCode = httpStatuses.Unauthorized
    constructor (message: string) {
        super(message)
    }
}