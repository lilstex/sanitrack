"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../helpers/response"));
// Define a list of non-restricted paths
const nonRestricted = [
    "/api/create-user",
    "/api/login",
    "/api/task/get-all-tasks/{qrcode}",
];
// Middleware function to handle authentication and authorization
const middleware = (req, res, next) => {
    // Check if the requested path is in the list of non-restricted paths
    if (nonRestricted.includes(req.path)) {
        // If it's a non-restricted path, proceed to the next middleware
        next();
    }
    else {
        // Verify the token for restricted paths
        let token;
        // Check if the request has an 'Authorization' header
        if (req.headers.authorization) {
            // Parse the 'Authorization' header
            const [authType, authToken] = req.headers.authorization.split(' ');
            // Check the authorization type ('Bearer' in this case)
            if (authType.toLowerCase() === 'bearer') {
                token = authToken;
            }
            else {
                // If not 'Bearer', consider the entire header as the token
                token = req.headers.authorization;
            }
            // Verify the token using the JWT library
            jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, user) => {
                if (err) {
                    // If token verification fails, respond with a forbidden error
                    return response_1.default.forbiddenResponse('Token is invalid or has expired!', res);
                }
                // If the token is valid, attach the user information to the request as 'auth'
                req.auth = user;
                // Proceed to the next middleware
                next();
            });
        }
        else {
            // If no 'Authorization' header is present, respond with an unauthorized error
            return response_1.default.unAuthorizedResponse('You are not authorized!', res);
        }
    }
};
exports.middleware = middleware;
//# sourceMappingURL=security.js.map