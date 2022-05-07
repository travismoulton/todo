import { Schema, model, Types } from 'mongoose';

export interface ITodo {
  title?: string;
  content: string;
  dueDateStr?: number;
  dueDate: Date;
  category?: string;
  isFinished: boolean;
  createdAt: Date;
  priority?: ['1', '2', '3'];
  user: Types.ObjectId;
  _id: string;
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, maxlength: [30, 'Title must be less than 30 characters'] },
  content: { type: String, required: [true, 'Todo content may not be empty'] },
  dueDateStr: Number,
  dueDate: Date,
  category: String,
  isFinished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['1', '2', '3'] },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
