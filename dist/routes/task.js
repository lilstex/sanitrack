"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_1 = __importDefault(require("../controllers/task"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const task_2 = __importDefault(require("../validator/task"));
// Create an Express Router
const routes = (0, express_1.Router)();
// Route for creating task
routes.post("/create-task", (0, validate_1.default)(task_2.default.createTask), task_1.default.createTask);
// Route for getting all tasks
routes.get("/get-all-tasks", task_1.default.getAllTasks);
// Route for getting all tasks by QRCODE
routes.get("/get-all-tasks-by-qrcode", task_1.default.getAllTasks);
// Route for getting task by id
routes.get("/get-single-task", task_1.default.getTask);
// Route for updating task
routes.put("/update-task", (0, validate_1.default)(task_2.default.updateTask), task_1.default.updateTask);
// Route for submitting task
routes.patch("/submit-task", (0, validate_1.default)(task_2.default.submitTask), task_1.default.submitTask);
// Route for deleting task
routes.delete("/delete-task", (0, validate_1.default)(task_2.default.deleteTask), task_1.default.deleteTask);
exports.default = routes;
//# sourceMappingURL=task.js.map