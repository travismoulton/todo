"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// export interface UserModel extends Model<IUser, {}, IUserMethods> {}
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: [true, 'Username required'], unique: true },
    password: { type: String, required: [true, 'Password required'] },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// userSchema.virtual('todos', {
//   ref: 'Todo',
//   foreignField: 'user',
//   localField: '_id',
// });
// Hash password upon user creation and password update
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
userSchema.method('correctPassword', async function (givenPassword) {
    return await bcryptjs_1.default.compare(givenPassword, this.password);
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
