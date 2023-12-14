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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../helpers/response"));
const user_1 = __importDefault(require("../models/user"));
const task_1 = __importDefault(require("../services/task"));
// Load environment variables from a .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_KEY = process.env.JWT_KEY;
const TOKEN_VALIDATION_DURATION = process.env.TOKEN_VALIDATION_DURATION;
/**
 * Create a new user.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, username, role } = req.body;
        // Check if username is already in use
        const lowerCaseUsername = username.toLowerCase();
        const existingUsername = yield user_1.default.findOne({ username: lowerCaseUsername });
        if (existingUsername) {
            return response_1.default.badRequestResponse('Username already in use', res);
        }
        // Encrypt password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        // Create new user
        const user = yield user_1.default.create({
            username: lowerCaseUsername,
            password: hashedPassword,
            role: role
        });
        // Serialize user data to return
        const newUser = {
            id: user._id,
            role: user.role,
            username: user.username,
        };
        return response_1.default.createResponse('User created successfully', newUser, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the create user endpoint', res, err);
    }
});
/**
 * Handle user login.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check if user exists
        const lowerCaseUsername = username.toLowerCase();
        const user = yield user_1.default.findOne({ username: lowerCaseUsername }).select('+password');
        if (!user) {
            return response_1.default.badRequestResponse('Incorrect credentials', res);
        }
        // Check if password matches
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return response_1.default.badRequestResponse('Incorrect credentials', res);
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username, role: user.role }, JWT_KEY, {
            expiresIn: TOKEN_VALIDATION_DURATION,
        });
        // Generate a QRCODE for cleaner
        let qrcode;
        if (user.role === 'cleaner') {
            const userId = user._id;
            const role = user.role;
            const qrCodeData = JSON.stringify({ userId, role });
            qrcode = yield task_1.default.generateQRCode(qrCodeData);
        }
        // Serialize user data
        const userData = {
            QRCode: qrcode.data || null,
            token,
            id: user._id,
            role: user.role,
            username: user.username
        };
        return response_1.default.successResponse('Login successful', userData, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the login endpoint', res, err);
    }
});
/**
 * Get user information.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with user information or error message
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure userId from query parameters
        const { userId } = req.query;
        // Check if userId is undefined
        if (!userId) {
            return response_1.default.badRequestResponse('User ID is required', res);
        }
        // Find user by ID
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return response_1.default.badRequestResponse('User not found', res);
        }
        // Return srialized user information
        return response_1.default.successResponse('User fetched successfully', user, res);
    }
    catch (err) {
        console.error(err);
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get user endpoint', res, err);
    }
});
/**
 * Get all users.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with all users or error message
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Explicitly cast query parameters to numbers and handle undefined
        const page = req.query.page ? Number(req.query.page) : undefined;
        const documentCount = req.query.documentCount ? Number(req.query.documentCount) : undefined;
        // Check if page or documentCount is undefined before using them
        if (page === undefined || documentCount === undefined) {
            return response_1.default.badRequestResponse('Invalid page or documentCount', res);
        }
        // Get the total count of registered users
        const totalUsers = yield user_1.default.countDocuments();
        // Fetch all users from the database
        const allUsers = yield user_1.default.find()
            .limit(documentCount)
            .skip(documentCount * (page - 1))
            .sort({ createdAt: -1 });
        // Calculate prevPage and nextPage
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = documentCount * page < totalUsers ? page + 1 : null;
        // Prepare data to send in the response
        const data = {
            page,
            prevPage,
            nextPage,
            documentCount,
            totalUsers,
            allUsers,
        };
        // Return success response with the list of users
        return response_1.default.successResponse('Users fetched successfully', data, res);
    }
    catch (err) {
        console.error(err);
        // Return server error response if an error occurs
        return response_1.default.serverErrorResponse('Oops... Something occurred in the get all users endpoint', res, err);
    }
});
/**
 * Update the username of the authenticated user.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with the updated user information or error message
 */
const updateUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure username from request body and id from auth
        const { username } = req.body;
        const { userId } = req.auth;
        // Find user by ID
        const user = yield user_1.default.findById(userId);
        // Check if the user is not found
        if (!user) {
            return response_1.default.badRequestResponse('User not found', res);
        }
        // Check if username is already in use
        const lowerCaseUsername = username.toLowerCase();
        const existingUsername = yield user_1.default.findOne({ username: lowerCaseUsername });
        if (existingUsername) {
            return response_1.default.badRequestResponse('Username already in use', res);
        }
        // Update username and save changes
        user.username = lowerCaseUsername;
        yield user.save();
        // Return success response with updated user information
        return response_1.default.successResponse('Username updated successfully', user, res);
    }
    catch (err) {
        console.error(err);
        // Return server error response if an error occurs
        return response_1.default.serverErrorResponse('Oops... Something occurred in the update username endpoint', res, err);
    }
});
/**
 * Delete the authenticated user and associated products.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with information about the deleted user and products or error message
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure id from auth
        const { userId } = req.auth;
        // Delete the user
        const deletedUser = yield user_1.default.findOneAndDelete({ _id: userId });
        // Return success response with information about the deleted user
        return response_1.default.successResponse('User deleted successfully', deletedUser, res);
    }
    catch (err) {
        console.error(err);
        // Return server error response if an error occurs
        return response_1.default.serverErrorResponse('Oops... Something occurred in delete endpoint', res, err);
    }
});
exports.default = {
    createUser,
    login,
    getUser,
    getAllUsers,
    updateUsername,
    deleteUser
};
//# sourceMappingURL=user.js.map