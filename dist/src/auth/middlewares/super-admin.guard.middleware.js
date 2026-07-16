"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminGuardMiddleware = void 0;
const http_statuses_1 = require("../../core/types/http-statuses");
const config_1 = require("../../settings/config");
const superAdminGuardMiddleware = (req, res, next) => {
    const auth = req.headers["authorization"];
    if (!auth) {
        res.sendStatus(http_statuses_1.httpStatuses.Unauthorized);
        return;
    }
    const [authType, token] = auth.split(" ");
    if (authType !== "Basic") {
        res.sendStatus(http_statuses_1.httpStatuses.Unauthorized);
        return;
    }
    const credentials = Buffer.from(token, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    if (username !== config_1.ADMIN_USERNAME && password !== config_1.ADMIN_PASSWORD) {
        res.sendStatus(http_statuses_1.httpStatuses.Unauthorized);
        return;
    }
    next();
};
exports.superAdminGuardMiddleware = superAdminGuardMiddleware;
