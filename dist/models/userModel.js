"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
userSchema.methods.correctPassword = async function (givenPassword, userPassword) {
    return await bcryptjs_1.default.compare(givenPassword, userPassword);
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
