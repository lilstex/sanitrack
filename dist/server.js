"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
// Define the port for the server to listen on
const PORT = parseInt(process.env.PORT || '5000', 10);
// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI;
// Create an HTTP server using Express
const server = http_1.default.createServer(index_1.default);
// Start the server and connect to the MongoDB database
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api-docs`);
    // Connect to MongoDB
    mongoose_1.default.connect(MONGODB_URI);
    // Event handler for successful MongoDB connection
    mongoose_1.default.connection.on('connected', () => {
        console.log('Database connected successfully');
    });
});
//# sourceMappingURL=server.js.map