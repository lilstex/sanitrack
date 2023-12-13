"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationSchemas = {
    // Schema for creating a user
    createUser: joi_1.default.object({
        username: joi_1.default.string().required(),
        role: joi_1.default.string().valid('admin', 'manager', 'inspector', 'cleaner').required(),
        password: joi_1.default.string().required(),
    }),
    // Schema for user login
    login: joi_1.default.object({
        username: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
    // Schema for get user
    updateUsername: joi_1.default.object({
        username: joi_1.default.string().required(),
    }),
};
exports.default = validationSchemas;
//# sourceMappingURL=user.js.map