"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationSchemas = {
    // Schema for creating a room
    createRoom: joi_1.default.object({
        roomName: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        details: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
        })),
    }),
    // Schema for room update
    updateRoom: joi_1.default.object({
        roomId: joi_1.default.string().required(),
        roomName: joi_1.default.string().required(),
        location: joi_1.default.string().required(),
        details: joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
        })),
    }),
    // Schema for deleting room by id
    deleteRoom: joi_1.default.object({
        roomId: joi_1.default.string().required(),
    }),
};
exports.default = validationSchemas;
//# sourceMappingURL=room.js.map