import { Schema, model } from 'mongoose';

// Create a Mongoose schema for RoomDetail
const roomDetailSchema = new Schema({
  detail: [{
    name: { type: String, required: true },
    isDone: { type: Boolean, default: false},
  }],
});

// Create a Mongoose model for RoomDetail
const RoomDetailModel = model('RoomDetail', roomDetailSchema);

export default RoomDetailModel;