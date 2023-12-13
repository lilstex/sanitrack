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
const response_1 = __importDefault(require("../helpers/response"));
// Middleware function to validate requests based on a Joi schema
const validateRequest = (obj) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Create a Joi schema and specify that unknown keys should be rejected
        const schema = obj.required().unknown(false);
        // Determine whether to validate query parameters or request body based on the HTTP method
        const value = req.method === 'GET' ? req.query : req.body;
        try {
            // Validate the incoming data against the defined schema
            const { error, value: vars } = yield schema.validateAsync(value);
            if (error) {
                // If validation fails, respond with a bad request error
                return response_1.default.badRequestResponse(error.message, res);
            }
            // Initialize publicData with default values
            let publicData = {
                _id: '',
                username: '',
                role: '',
            };
            // If authData exists in the request (user is authenticated), update publicData
            if (req.authData) {
                publicData = {
                    _id: req.authData._id,
                    username: req.authData.username,
                    role: req.authData.role,
                };
            }
            // Combine the validated data and public data to create personalData
            const personalData = Object.assign(Object.assign({}, vars), publicData);
            // Attach the combined data to the request object as 'form'
            req.form = personalData;
            next();
        }
        catch (err) {
            // If an error occurs during validation, respond with a server error
            return response_1.default.serverErrorResponse('Internal Server Error', res, err);
        }
    });
};
exports.default = validateRequest;
//# sourceMappingURL=validate.js.map