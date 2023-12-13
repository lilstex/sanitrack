import Joi from 'joi';

// Define and export validation schemas using Joi
interface CreateUserSchema {
  username: string;
  password: string;
  role: string;
}

interface LoginSchema {
  username: string;
  password: string;
}

interface updateUsernameSchema {
  username: string;
}


const validationSchemas = {
  // Schema for creating a user
  createUser: Joi.object<CreateUserSchema>({
    username: Joi.string().required(),
    role: Joi.string().valid('admin', 'manager', 'inspector', 'cleaner').required(),
    password: Joi.string().required(),
  }),

  // Schema for user login
  login: Joi.object<LoginSchema>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  // Schema for get user
  updateUsername: Joi.object<updateUsernameSchema>({
    username: Joi.string().required(),
  }),
};

export default validationSchemas;
