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
const room_1 = __importDefault(require("../models/room"));
const roomDetail_1 = __importDefault(require("../models/roomDetail"));
const task_1 = __importDefault(require("../models/task"));
const response_1 = __importDefault(require("../helpers/response"));
/**
 * Create a new room with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { roomName, location, details } = req.body;
        // Validate the request body
        if (!roomName || !location || !details || details.length === 0) {
            return response_1.default.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to create room', res);
        }
        // Create a new RoomDetail instance
        const roomDetail = yield roomDetail_1.default.create({
            detail: details
        });
        // Create a new Room instance referencing the created RoomDetail
        const room = yield room_1.default.create({
            roomName,
            location,
            detail: roomDetail._id,
        });
        return response_1.default.createResponse('Room created successfully', room, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the create room endpoint', res, err);
    }
});
/**
 * Get all rooms with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        // Explicitly cast query parameters to numbers and handle undefined
        // const page = req.query.page ? Number(req.query.page) : undefined;
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to list all rooms', res);
        }
        const roomQuery = room_1.default.find()
            .populate('detail')
            .sort({ createdAt: -1 });
        const [totalRooms, allRooms] = yield Promise.all([
            room_1.default.countDocuments(),
            roomQuery.exec(),
        ]);
        // Prepare data to send in the response
        const data = {
            totalRooms,
            allRooms,
        };
        // Return success response with paginated task information
        return response_1.default.successResponse('Get all rooms successful', data, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get all room endpoint', res, err);
    }
});
/**
 * View room with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const roomId = req.query.roomId;
        // Check if page or documentCount is undefined before using them
        if (!roomId) {
            return response_1.default.badRequestResponse('Missing required query param <roomId>', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to view room details', res);
        }
        const room = yield room_1.default.findOne()
            .populate('detail')
            .exec();
        if (!room) {
            return response_1.default.badRequestResponse("Room not found or not permitted to view this task", res);
        }
        // Return success response with room information
        return response_1.default.successResponse('Room retrieved successfully', room, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get room endpoint', res, err);
    }
});
/**
 * Update room
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const updateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { roomId, roomName, location, details } = req.body;
        // Validate the request body
        if (!roomId || !roomName || !location || !details) {
            return response_1.default.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You do not have permission to update room', res);
        }
        // Get the room and update its details
        const room = yield room_1.default.findById(roomId);
        if (!room) {
            return response_1.default.badRequestResponse("Room not found", res);
        }
        // Get RoomDetail and update
        const roomDetail = yield roomDetail_1.default.findById(room.detail);
        if (!roomDetail) {
            return response_1.default.badRequestResponse("Room details not found", res);
        }
        roomDetail.detail = details;
        yield roomDetail.save();
        // Update room
        room.roomName = roomName;
        room.location = location;
        yield room.save();
        return response_1.default.successResponse('Room updated successfully', room, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the update room endpoint', res, err);
    }
});
/**
 * Delete room
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.auth;
        const { roomId } = req.body;
        // Validate the request body
        if (!roomId) {
            return response_1.default.badRequestResponse('Missing required field', res);
        }
        // Check role of the user
        if (role === 'cleaner' || role === 'inspector') {
            return response_1.default.badRequestResponse('You are not permitted to delete room', res);
        }
        // Get the room and delete the room
        const room = yield room_1.default.findOne({ _id: roomId });
        if (!room) {
            return response_1.default.badRequestResponse("Room not found", res);
        }
        // Delete associated room detail
        // await RoomDetailModel.deleteMany({room: roomId});
        yield task_1.default.deleteMany({ assigned_room: roomId });
        yield room_1.default.deleteOne({ _id: roomId });
        return response_1.default.createResponse('Room deleted successfully', room, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the delete room endpoint', res, err);
    }
});
exports.default = {
    createRoom,
    getRoom,
    getAllRooms,
    updateRoom,
    deleteRoom,
};
//# sourceMappingURL=room.js.map