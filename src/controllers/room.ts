import { Request, Response } from 'express';
import RoomModel from '../models/room';
import RoomDetailModel from '../models/roomDetail';
import TaskModel from '../models/task';
import customResponse from '../helpers/response';
import { AuthenticatedRequest } from '../middlewares/security';

/**
 * Create a new room with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { roomName, location, details } = req.body;

        // Validate the request body
        if (!roomName || !location || !details || details.length === 0) {
            return customResponse.badRequestResponse('Missing required fields', res);
        }

        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to create room', res);
        }

        // Create a new RoomDetail instance
        const roomDetail = await RoomDetailModel.create({
            detail: details
        });

        // Create a new Room instance referencing the created RoomDetail
        const room = await RoomModel.create({
            roomName,
            detail: roomDetail._id,
        });

        return customResponse.createResponse('Room created successfully', room, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the create room endpoint',
            res,
            err
        );
    }
};

/**
 * Get all rooms with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getAllRooms = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        // Explicitly cast query parameters to numbers and handle undefined
        // const page = req.query.page ? Number(req.query.page) : undefined;

        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to list all rooms', res);
        }

        const roomQuery = RoomModel.find()
            .populate('assigned_inspector assigned_manager assigned_cleaner assigned_room')
            .sort({ createdAt: -1 });

        const [totalRooms, allRooms] = await Promise.all([
            RoomModel.countDocuments(),
            roomQuery.exec(),
        ]);

        // Prepare data to send in the response
        const data = {
            totalRooms,
            allRooms,
        };

        // Return success response with paginated task information
        return customResponse.successResponse('Get all rooms successful', data, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get all room endpoint',
            res,
            err
        );
    }
};

/**
 * View room with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const roomId = req.query.roomId;

        // Check if page or documentCount is undefined before using them
        if (!roomId) {
            return customResponse.badRequestResponse('Missing required query param <roomId>', res);
        }
        
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to view room details', res);
        }
        
        const room = await RoomModel.findOne()
            .populate('detail')
            .exec();
        
        if(!room) {
            return customResponse.badRequestResponse("Room not found or not permitted to view this task", res);
        }
        
        // Return success response with room information
        return customResponse.successResponse('Room retrieved successfully', room, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get room endpoint',
            res,
            err
        );
    }
};

/**
 * Update room
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const updateRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { roomId, roomName, location, details } = req.body;
        // Validate the request body
        if (!roomId || !roomName || !location || !details) {
            return customResponse.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to update room', res);
        }

        // Get the room and update its details
        const room = await RoomModel.findById(roomId);
        if(!room) {
            return customResponse.badRequestResponse("Room not found", res);
        }

        // Get RoomDetail and update
        const roomDetail = await RoomDetailModel.findById(room.detail);
        if(!roomDetail) {
            return customResponse.badRequestResponse("Room details not found", res);
        }
        roomDetail.detail = details
        await roomDetail.save();

        // Update room
        room.roomName = roomName;
        room.location = location;
        await room.save();
       
        return customResponse.successResponse('Room updated successfully', room, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the update room endpoint',
            res,
            err
        );
    }
};

/**
 * Delete room
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const deleteRoom = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { roomId } = req.body;
        // Validate the request body
        if (!roomId ) {
            return customResponse.badRequestResponse('Missing required field', res);
        }
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You are not permitted to delete room', res);
        }

        // Get the room and delete the room
        const room = await RoomModel.findOne({_id: roomId});
        if(!room) {
            return customResponse.badRequestResponse("Room not found", res);
        }

        // Delete associated room detail
        // await RoomDetailModel.deleteMany({room: roomId});
        await TaskModel.deleteMany({assigned_room: roomId});

        await RoomModel.deleteOne({_id: roomId});
     
        return customResponse.createResponse('Room deleted successfully', room, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the delete room endpoint',
            res,
            err
        );
    }
};




export default {
    createRoom,
    getRoom,
    getAllRooms,
    updateRoom,
    deleteRoom,
};
