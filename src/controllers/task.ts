import { Request, Response } from 'express';
import TaskModel from '../models/task';
import customResponse from '../helpers/response';
import { AuthenticatedRequest } from '../middlewares/security';
import RoomService from '../services/room';
import TaskService from '../services/task';

/**
 * Create a new task with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role, userId } = req.auth;
        const { roomId, inspectorId, cleanerId } = req.body;
        // Validate the request body
        if (!roomId || !inspectorId || !cleanerId) {
            return customResponse.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to create task', res);
        }

        // Get the room details and create task with it
        const { data: room, status, message} = await RoomService.getRoom(roomId);
   
        if(!status) {
            return customResponse.badRequestResponse(`${message}`, res);
        }

        // Create the task
        const task = await TaskModel.create({
            assigned_inspector: inspectorId, 
            assigned_manager: userId,
            assigned_cleaner: cleanerId,
            assigned_room: roomId,
            tasks: room.detail
        })

        if(!task) {
            return customResponse.badRequestResponse('Failed to create task.', res);
        }

        return customResponse.createResponse('Task created successfully', task, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the create task endpoint',
            res,
            err
        );
    }
};

/**
 * Submit task with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const submitTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { details, taskId } = req.body;
        // Validate the request body
        if (!details || !taskId ) {
            return customResponse.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if(role !== 'cleaner') {
            return customResponse.badRequestResponse('You are not permitted to submit task', res);
        }

        // Get the task and update its details
        const task = await TaskModel.findById(taskId);
        if(!task) {
            return customResponse.badRequestResponse("Task not found", res);
        }
        // Update task with submitted details
        task.tasks = details
        task.isSubmitted = true;
        await task.save();
       
        return customResponse.createResponse('Task submitted successfully', task, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the submit task endpoint',
            res,
            err
        );
    }
};

/**
 * Get all tasks with its completed details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getAllTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        let urole;
        let uid;
        
        if (req.query.qrcode) {
            // Extract the QR code parameter from the request
            const qrcode = req.query.qrcode;
            // Decode the QR code data
            const {data: decodedData, status} = await TaskService.decodeQRCode(qrcode);
            if(status === false) {
                return customResponse.badRequestResponse(decodedData.message, res);
            }
            // Extract user ID or other relevant data from the decoded QR code
            const obj = JSON.parse(decodedData)
            urole = obj.role;
            uid = obj.userId;
            
        } else if (req.auth) {
            // Destructure role and userId from req.auth
            const { userId, role} = req.auth;
            urole = role;
            uid = userId;
        } else {
            return customResponse.badRequestResponse('Missing params.', res);
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

        const taskQuery = TaskModel.find(query)
            .populate('assigned_inspector assigned_manager assigned_cleaner assigned_room')
            .sort({ createdAt: -1 });

        const [totalTasks, allTasks] = await Promise.all([
            TaskModel.countDocuments(query),
            taskQuery.exec(),
        ]);


        // Prepare data to send in the response
        const data = {
            totalTasks,
            allTasks,
        };

        // Return success response with paginated task information
        return customResponse.successResponse('Get all tasks successful', data, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get all task endpoint',
            res,
            err
        );
    }
};

/**
 * View task with its details.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const getTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role, userId } = req.auth;
        const taskId = req.query.taskId;

        // Check if page or documentCount is undefined before using them
        if (!taskId) {
            return customResponse.badRequestResponse('Missing required query param <taskId>', res);
        }
        const query = {
            _id: taskId,
            ...(role === 'cleaner' && { assigned_cleaner: userId }),
            ...(role === 'inspector' && { assigned_inspector: userId }),
            ...(role === 'manager' && { assigned_manager: userId }),
        };
        
        const task = await TaskModel.findOne(query)
            .populate('assigned_inspector assigned_manager assigned_cleaner assigned_room')
            .exec();
        
        if(!task) {
            return customResponse.badRequestResponse("Task not found or not permitted to view this task", res);
        }
        
        // Return success response with task information
        return customResponse.successResponse('Task retrieved successfully', task, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get task endpoint',
            res,
            err
        );
    }
};

/**
 * Update task
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { roomId, inspectorId, cleanerId, taskId } = req.body;
        // Validate the request body
        if (!roomId || !inspectorId || !cleanerId || !taskId) {
            return customResponse.badRequestResponse('Missing required fields', res);
        }
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You do not have permission to update task', res);
        }

        // Get the task and update its details
        const task = await TaskModel.findById(taskId);
        if(!task) {
            return customResponse.badRequestResponse("Task not found", res);
        }
        // Update task
        task.assigned_inspector = inspectorId;
        task.assigned_cleaner = cleanerId;
        await task.save();
       
        return customResponse.createResponse('Task updated successfully', task, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the update task endpoint',
            res,
            err
        );
    }
};

/**
 * Delete task
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { role } = req.auth;
        const { taskId } = req.body;
        // Validate the request body
        if (!taskId ) {
            return customResponse.badRequestResponse('Missing required field', res);
        }
        // Check role of the user
        if(role === 'cleaner' || role === 'inspector') {
            return customResponse.badRequestResponse('You are not permitted to delete task', res);
        }

        // Get the task and update its details
        const task = await TaskModel.findByIdAndDelete(taskId);
     
        return customResponse.createResponse('Task deleted successfully', task, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the delete task endpoint',
            res,
            err
        );
    }
};


export default {
    createTask,
    submitTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
};
