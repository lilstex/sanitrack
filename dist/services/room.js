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
const room_1 = __importDefault(require("../models/room"));
const getRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room = yield room_1.default.findById(roomId).populate('detail');
        if (!room) {
            return {
                status: false,
                message: 'Room not found'
            };
        }
        return {
            status: true,
            message: 'Room found',
            data: JSON.parse(JSON.stringify(room.detail))
        };
    }
    catch (error) {
        console.log(error);
        return {
            status: false,
            message: 'Something went wrong when getting the room by ID'
        };
    }
});
exports.default = {
    getRoom,
};
//# sourceMappingURL=room.js.map