"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const user_2 = __importDefault(require("../validator/user"));
// Create an Express Router
const routes = (0, express_1.Router)();
// Route for creating a user account
routes.post("/create-user", (0, validate_1.default)(user_2.default.createUser), user_1.default.createUser);
// Route for user login
routes.post("/login", (0, validate_1.default)(user_2.default.login), user_1.default.login);
// Route for getting user details
routes.get("/get-user", user_1.default.getUser);
// Route for getting all users
routes.get("/get-all-users", user_1.default.getAllUsers);
// Route for getting all users
routes.patch("/update-username", (0, validate_1.default)(user_2.default.updateUsername), user_1.default.updateUsername);
// Route for deleting user account
routes.delete("/delete-user", user_1.default.deleteUser);
exports.default = routes;
//# sourceMappingURL=user.js.map