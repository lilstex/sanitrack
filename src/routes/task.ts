import { Router } from 'express';
import task from '../controllers/task';
import validate from '../middlewares/validate';
import validator from '../validator/task'

// Create an Express Router
const routes = Router();

// Route for creating task
routes.post(
    "/create-task",
    validate(validator.createTask),
    task.createTask
);

// Route for getting all tasks
routes.get(
    "/get-all-tasks",
    task.getAllTasks
);

// Route for getting all tasks by QRCODE
routes.get(
    "/get-all-tasks/{qrcode}",
    task.getAllTasks
);

// Route for getting task by id
routes.get(
    "/get-single-task",
    task.getTask
);

// Route for updating task
routes.put(
    "/update-task",
    validate(validator.updateTask),
    task.updateTask
);

// Route for submitting task
routes.patch(
    "/submit-task",
    validate(validator.submitTask),
    task.submitTask
);

// Route for deleting task
routes.delete(
    "/delete-task",
    validate(validator.deleteTask),
    task.deleteTask
);


export default routes;