"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_1 = __importDefault(require("../controllers/room"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const room_2 = __importDefault(require("../validator/room"));
// Create an Express Router
const routes = (0, express_1.Router)();
// Route for creating room
routes.post("/create-room", (0, validate_1.default)(room_2.default.createRoom), room_1.default.createRoom);
// Route for getting all rooms
routes.get("/get-all-rooms", room_1.default.getAllRooms);
// Route for getting room by id
routes.get("/get-single-room", room_1.default.getRoom);
// Route for updating room
routes.put("/update-room", (0, validate_1.default)(room_2.default.updateRoom), room_1.default.updateRoom);
// Route for deleting room
routes.delete("/delete-room", (0, validate_1.default)(room_2.default.deleteRoom), room_1.default.deleteRoom);
exports.default = routes;
//# sourceMappingURL=room.js.map