import { Router, Request, Response, NextFunction } from 'express';
import userRoutes from './user';
import roomRoutes from './room';
import taskRoutes from './task';

import customResponse from '../helpers/response';

// Create an Express Router
const routes = Router();

// Use the userRoutes for the root path ("/")
routes.use("", userRoutes);
// Use the roomRoutes for the "/room" path
routes.use("/room", roomRoutes);
// Use the taskRoutes for the "/task" path
routes.use("/task", taskRoutes);

// Handle requests for unknown routes
routes.use((_, res: Response) => {
    customResponse.notFoundResponse('Route not found', res);
});

export default routes;