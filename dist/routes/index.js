"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const room_1 = __importDefault(require("./room"));
const task_1 = __importDefault(require("./task"));
const response_1 = __importDefault(require("../helpers/response"));
// Create an Express Router
const routes = (0, express_1.Router)();
// Use the userRoutes for the root path ("/")
routes.use("", user_1.default);
// Use the roomRoutes for the "/room" path
routes.use("/room", room_1.default);
// Use the taskRoutes for the "/task" path
routes.use("/task", task_1.default);
// Handle requests for unknown routes
routes.use((_, res) => {
    response_1.default.notFoundResponse('Route not found', res);
});
exports.default = routes;
//# sourceMappingURL=index.js.map