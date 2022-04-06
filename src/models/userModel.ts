import { Schema, Model, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// interface IUserMethods {
//   correctPassword: (givenPassword: string) => Promise<boolean>;
// }

export interface IUser {
  _id: string;
  name: string;
  password: string;
  correctPassword: (givenPassword: string) => Promise<boolean>;
}

// export interface UserModel extends Model<IUser, {}, IUserMethods> {}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Username required'], unique: true },
    password: { type: String, required: [true, 'Password required'] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// userSchema.virtual('todos', {
//   ref: 'Todo',
//   foreignField: 'user',
//   localField: '_id',
// });

// Hash password when the user is created
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.method('correctPassword', async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
});

const User = model<IUser>('User', userSchema);

export default User;
