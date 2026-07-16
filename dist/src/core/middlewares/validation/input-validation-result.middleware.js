"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationResultMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../../types/http-statuses");
const formatErrors = (error) => {
    if (error.type === "field") {
        return { field: error.path, message: error.msg };
    }
    return { field: null, message: error.msg };
};
const inputValidationResultMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });
    if (errors.length > 0) {
        res.status(http_statuses_1.httpStatuses.BadRequest).json({ errorsMessages: errors });
        return;
    }
    next();
};
exports.inputValidationResultMiddleware = inputValidationResultMiddleware;
