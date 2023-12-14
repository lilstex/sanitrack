"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("../models/task"));
const response_1 = __importDefault(require("../helpers/response"));
const room_1 = __importDefault(require("../services/room"));
const task_2 = __importDefault(require("../services/task"));
/**
 * Create a new task with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId } = req.auth;
        const { roomId, inspectorId, cleanerId } = req.body;
        // Validate the request body
        if (!roomId || !inspectorId || !cleanerId) {
            return response_1.default.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to create task', res);
        }
        // Get the room details and create task with it
        const { data: room, status, message } = yield room_1.default.getRoom(roomId);
        if (!status) {
            return response_1.default.badRequestResponse(`${message}`, res);
        }
        // Create the task
        const task = yield task_1.default.create({
            assigned_inspector: inspectorId,
            assigned_manager: userId,
            assigned_cleaner: cleanerId,
            assigned_room: roomId,
            tasks: room.detail
        });
        if (!task) {
            return response_1.default.badRequestResponse('Failed to create task.', res);
        }
        return response_1.default.createResponse('Task created successfully', task, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the create task endpoint', res, err);
    }
});
/**
 * Submit task with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const submitTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { details, taskId } = req.body;
        // Validate the request body
        if (!details || !taskId) {
            return response_1.default.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if (role !== 'cleaner') {
            return response_1.default.badRequestResponse('You are not permitted to submit task', res);
        }
        // Get the task and update its details
        const task = yield task_1.default.findById(taskId);
        if (!task) {
            return response_1.default.badRequestResponse("Task not found", res);
        }
        // Update task with submitted details
        task.tasks = details;
        task.isSubmitted = true;
        yield task.save();
        return response_1.default.createResponse('Task submitted successfully', task, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the submit task endpoint', res, err);
    }
});
/**
 * Get all tasks with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let urole;
        let uid;
        if (req.query.qrcode) {
            // Extract the QR code parameter from the request
            const qrcode = req.query.qrcode;
            // Decode the QR code data
            const { data: decodedData, status } = yield task_2.default.decodeQRCode(qrcode);
            if (status === false) {
                return response_1.default.badRequestResponse(decodedData.message, res);
            }
            // Extract user ID or other relevant data from the decoded QR code
            const obj = JSON.parse(decodedData);
            urole = obj.role;
            uid = obj.userId;
        }
        else if (req.auth) {
            // Destructure role and userId from req.auth
            const { userId, role } = req.auth;
            urole = role;
            uid = userId;
        }
        else {
            return response_1.default.badRequestResponse('Missing params.', res);
        }
        let query = {};
        switch (urole) {
            case 'cleaner':
                query = { assigned_cleaner: uid, isSubmitted: false };
                break;
            case 'inspector':
                query = { assigned_inspector: uid };
                break;
            case 'manager':
                query = { assigned_manager: uid };
                break;
        }
        const taskQuery = task_1.default.find(query)
            .populate('assigned_inspector assigned_manager assigned_cleaner assigned_room')
            .sort({ createdAt: -1 });
        const [totalTasks, allTasks] = yield Promise.all([
            task_1.default.countDocuments(query),
            taskQuery.exec(),
        ]);
        // Prepare data to send in the response
        const data = {
            totalTasks,
            allTasks,
        };
        // Return success response with paginated task information
        return response_1.default.successResponse('Get all tasks successful', data, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get all task endpoint', res, err);
    }
});
/**
 * View task with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, userId } = req.auth;
        const taskId = req.query.taskId;
        // Check if page or documentCount is undefined before using them
        if (!taskId) {
            return response_1.default.badRequestResponse('Missing required query param <taskId>', res);
        }
        const query = Object.assign(Object.assign(Object.assign({ _id: taskId }, (role === 'cleaner' && { assigned_cleaner: userId })), (role === 'inspector' && { assigned_inspector: userId })), (role === 'manager' && { assigned_manager: userId }));
        const task = yield task_1.default.findOne(query)
            .populate('assigned_inspector assigned_manager assigned_cleaner assigned_room')
            .exec();
        if (!task) {
            return response_1.default.badRequestResponse("Task not found or not permitted to view this task", res);
        }
        // Return success response with task information
        return response_1.default.successResponse('Task retrieved successfully', task, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get task endpoint', res, err);
    }
});
/**
 * Update task
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { roomId, inspectorId, cleanerId, taskId } = req.body;
        // Validate the request body
        if (!roomId || !inspectorId || !cleanerId || !taskId) {
            return response_1.default.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to update task', res);
        }
        // Get the task and update its details
        const task = yield task_1.default.findById(taskId);
        if (!task) {
            return response_1.default.badRequestResponse("Task not found", res);
        }
        // Update task
        task.assigned_inspector = inspectorId;
        task.assigned_cleaner = cleanerId;
        yield task.save();
        return response_1.default.createResponse('Task updated successfully', task, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the update task endpoint', res, err);
    }
});
/**
 * Delete task
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { taskId } = req.body;
        // Validate the request body
        if (!taskId) {
            return response_1.default.badRequestResponse('Missing required field', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You are not permitted to delete task', res);
        }
        // Get the task and update its details
        const task = yield task_1.default.findByIdAndDelete(taskId);
        return response_1.default.createResponse('Task deleted successfully', task, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the delete task endpoint', res, err);
    }
});
exports.default = {
    createTask,
    submitTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
};
//# sourceMappingURL=task.js.map