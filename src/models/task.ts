import mongoose, { Document, Schema, model, Types } from 'mongoose';
import RoomModel from './room';
import User from './user';


// Define interface for task
interface Task extends Document {
  assigned_inspector: mongoose.Types.ObjectId; 
  assigned_manager: mongoose.Types.ObjectId; 
  assigned_cleaner: mongoose.Types.ObjectId; 
  assigned_room: mongoose.Types.ObjectId; 
  isSubmitted: boolean;
  tasks: [{
    name: { type: String, required: true },
    isDone: { type: Boolean, required: true, default: false},
  }]
}

// Create a Mongoose schema for Room
const taskSchema = new Schema<Task>({
    assigned_inspector: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    assigned_manager: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    assigned_cleaner: {type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    assigned_room: {type: mongoose.Schema.Types.ObjectId, ref: RoomModel, required: true },
    isSubmitted: {type: Boolean, default: false},
    tasks: [{
      name: { type: String, required: true },
      isDone: { type: Boolean, required: true, default: false},
    }]
});

// Create a Mongoose model for Task
const TaskModel = model<Task>('Task', taskSchema);

export default TaskModel;
