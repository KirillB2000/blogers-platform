"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatuses = void 0;
var httpStatuses;
(function (httpStatuses) {
    httpStatuses[httpStatuses["Ok"] = 200] = "Ok";
    httpStatuses[httpStatuses["Created"] = 201] = "Created";
    httpStatuses[httpStatuses["NoContent"] = 204] = "NoContent";
    httpStatuses[httpStatuses["BadRequest"] = 400] = "BadRequest";
    httpStatuses[httpStatuses["Unauthorized"] = 401] = "Unauthorized";
    httpStatuses[httpStatuses["Forbidden"] = 403] = "Forbidden";
    httpStatuses[httpStatuses["NotFound"] = 404] = "NotFound";
    httpStatuses[httpStatuses["InternalServerError"] = 500] = "InternalServerError";
})(httpStatuses || (exports.httpStatuses = httpStatuses = {}));
