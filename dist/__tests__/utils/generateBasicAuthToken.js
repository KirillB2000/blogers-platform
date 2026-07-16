"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBasicAuthToken = void 0;
const config_1 = require("../../src/settings/config");
const generateBasicAuthToken = () => {
    const credentials = `${config_1.ADMIN_USERNAME}:${config_1.ADMIN_PASSWORD}`;
    const token = Buffer.from(credentials).toString("base64");
    return `Basic ${token}`;
};
exports.generateBasicAuthToken = generateBasicAuthToken;
