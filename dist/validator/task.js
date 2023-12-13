"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationSchemas = {
    // Schema for creating a task
    createTask: joi_1.default.object({
        inspectorId: joi_1.default.string().required(),
        cleanerId: joi_1.default.string().required(),
        roomId: joi_1.default.string().required(),
    }),
    // Schema for task update
    updateTask: joi_1.default.object({
        taskId: joi_1.default.string().required(),
        inspectorId: joi_1.default.string().required(),
        cleanerId: joi_1.default.string().required(),
        roomId: joi_1.default.string().required(),
    }),
    // Schema for task submission
    submitTask: joi_1.default.object({
        taskId: joi_1.default.string().required(),
        details: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            isDone: joi_1.default.boolean().required(),
        })),
    }),
    // Schema for deleting task by id
    deleteTask: joi_1.default.object({
        taskId: joi_1.default.string().required(),
    }),
};
exports.default = validationSchemas;
//# sourceMappingURL=task.js.map