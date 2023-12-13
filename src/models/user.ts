import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    role: string;
    password: string;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: 'cleaner'}
});

const User = mongoose.model<User>('User', userSchema);

export default User;