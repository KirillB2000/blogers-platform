"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const testing_paths_1 = require("../constants/testing.paths");
const testingDeleteAllData_handler_1 = require("./handlers/testingDeleteAllData.handler");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete(testing_paths_1.TESTING_ROUTES.ALL_DATA, testingDeleteAllData_handler_1.testingDeleteAllDataHandler);
