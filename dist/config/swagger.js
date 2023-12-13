"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Get the port from the environment variables
const PORT = parseInt(process.env.PORT || '5000', 10);
// Define the Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: '1.0.0',
            title: 'SANI-TRACK API',
            contact: { name: 'Emmanuel Mbagwu' },
            servers: [{ url: `http://localhost:${PORT}` }]
        }
    },
    // Specify the location of Swagger API documentation files
    apis: ['./src/swaggerDocs/**/*.yml']
};
// Generate Swagger documentation using swagger-jsdoc
const swaggerDocument = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Export the generated Swagger documentation
exports.default = swaggerDocument;
//# sourceMappingURL=swagger.js.map