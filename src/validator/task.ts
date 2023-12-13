import Joi from 'joi';

// Define and export validation schemas using Joi
interface CreateTaskSchema {
    inspectorId: string; 
    cleanerId: string; 
    roomId: string; 
}

interface UpdateTaskSchema {
    taskId: string;
    inspectorId: string; 
    cleanerId: string; 
    roomId: string; 
}

interface SubmitTaskSchema {
    taskId: string;
    details: [{ name: string, isDone: boolean}];
}

interface DeleteTaskSchema {
    taskId: string;
}


const validationSchemas = {
    // Schema for creating a task
    createTask: Joi.object<CreateTaskSchema>({
        inspectorId: Joi.string().required(),
        cleanerId: Joi.string().required(),
        roomId: Joi.string().required(),
    }),

    // Schema for task update
    updateTask: Joi.object<UpdateTaskSchema>({
        taskId: Joi.string().required(),
        inspectorId: Joi.string().required(),
        cleanerId: Joi.string().required(),
        roomId: Joi.string().required(),
    }),

    // Schema for task submission
    submitTask: Joi.object<SubmitTaskSchema>({
        taskId: Joi.string().required(),
        details: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            isDone: Joi.boolean().required(),
        })),
    }),

    // Schema for deleting task by id
    deleteTask: Joi.object<DeleteTaskSchema>({
        taskId: Joi.string().required(),
    }),

};

export default validationSchemas;
