import { Schema, model, Types } from 'mongoose';

interface ITodo {
  title?: string;
  content: string;
  dueDate?: Date;
  category?: string;
  isFinished: boolean;
  createdAt: Date;
  priority?: ['1', '2', '3'];
  user: Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, maxlength: [30, 'Title must be less than 30 characters'] },
  content: { type: String, required: [true, 'Todo content may not be empty'] },
  dueDate: Date,
  category: String,
  isFinished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  priority: { type: Number, enum: ['1', '2', '3'] },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Todo = model('Todo', todoSchema);

export default Todo;
