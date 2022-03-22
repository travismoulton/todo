import { Schema, Model, model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  name: string;
  password: string;
}

interface IUserMethods {
  correctPassword: (givenPassword: string, userPassword: string) => Promise<boolean>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: [true, 'Username required'], unique: true },
    password: { type: String, required: [true, 'Password required'] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('todos', {
  ref: 'Todo',
  foreignField: 'user',
  localField: '_id',
});

userSchema.methods.correctPassword = async function (givenPassword, userPassword) {
  return await bcrypt.compare(givenPassword, userPassword);
};

const User = model<IUser>('User', userSchema);

export default User;
