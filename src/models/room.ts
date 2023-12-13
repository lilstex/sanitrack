import mongoose, { Document, Schema, model, Types } from 'mongoose';
import RoomDetailModel from './roomDetail';


// Define interface for room
interface Room extends Document {
  roomName: string;
  location: string;
  detail: mongoose.Types.ObjectId; 
}

// Create a Mongoose schema for Room
const roomSchema = new Schema<Room>({
  roomName: { type: String, required: true },
  location: { type: String, required: true },
  detail: {type: mongoose.Schema.Types.ObjectId, ref: RoomDetailModel, required: true },
});

// Create a Mongoose model for Room
const RoomModel = model<Room>('Room', roomSchema);

export default RoomModel;
