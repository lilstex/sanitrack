"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseStatusCode = {
    success: 200,
    created: 201,
    bad_request: 400,
    unauthorized: 401,
    forbidden: 403,
    not_found: 404,
    internal_server_error: 500,
};
const createResponse = (message, data, res) => {
    res.status(responseStatusCode.created).json({
        status: true,
        message,
        data,
    });
};
const successResponse = (message, data, res) => {
    res.status(responseStatusCode.success).json({
        status: true,
        message,
        data,
    });
};
const badRequestResponse = (message, res) => {
    res.status(responseStatusCode.bad_request).json({
        status: false,
        message,
    });
};
const unAuthorizedResponse = (message, res) => {
    res.status(responseStatusCode.unauthorized).json({
        status: false,
        message,
    });
};
const forbiddenResponse = (message, res) => {
    res.status(responseStatusCode.forbidden).json({
        status: false,
        message,
    });
};
const notFoundResponse = (message, res) => {
    res.status(responseStatusCode.not_found).json({
        status: false,
        message,
    });
};
const serverErrorResponse = (message, res, err) => {
    res.status(responseStatusCode.internal_server_error).json({
        status: false,
        message,
        err
    });
};
exports.default = {
    successResponse,
    serverErrorResponse,
    badRequestResponse,
    unAuthorizedResponse,
    forbiddenResponse,
    notFoundResponse,
    createResponse,
};
//# sourceMappingURL=response.js.map