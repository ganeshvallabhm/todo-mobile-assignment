import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITask extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  dateTime?: Date;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dateTime: { type: Date },
    deadline: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', TaskSchema);
