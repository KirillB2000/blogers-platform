"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idValidation = void 0;
const express_validator_1 = require("express-validator");
exports.idValidation = (0, express_validator_1.param)('id')
    .exists().withMessage('ID is required')
    .isString().withMessage('ID must be a string')
    .isLength({ min: 1 }).withMessage('ID must not to be empty')
    .isNumeric().withMessage('ID must be a numeric string');
