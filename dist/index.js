"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const security_1 = require("./middlewares/security");
const response_1 = __importDefault(require("./helpers/response"));
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = __importDefault(require("./config/swagger"));
// Load environment variables from a .env file
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
// Enable Cross-Origin Resource Sharing (CORS)
app.use((0, cors_1.default)());
// Parse JSON bodies in requests
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
// Serve Swagger documentation at /api-docs using swagger-ui
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Middleware for security measures
app.use(security_1.middleware);
// Use the defined routes for handling API requests
app.use('/api', routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    // Handle internal server errors and send a custom response
    return response_1.default.serverErrorResponse("Internal server error", res, err);
});
exports.default = app;
//# sourceMappingURL=index.js.map