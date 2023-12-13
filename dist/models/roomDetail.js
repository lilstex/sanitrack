"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create a Mongoose schema for RoomDetail
const roomDetailSchema = new mongoose_1.Schema({
    detail: [{
            name: { type: String, required: true },
            isDone: { type: Boolean, default: false },
        }],
});
// Create a Mongoose model for RoomDetail
const RoomDetailModel = (0, mongoose_1.model)('RoomDetail', roomDetailSchema);
exports.default = RoomDetailModel;
//# sourceMappingURL=roomDetail.js.map