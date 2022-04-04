"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// import { promisify } from 'util';
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendErrorJson_1 = __importDefault(require("./sendErrorJson"));
dotenv_1.default.config({ path: './config.env' });
const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
function signToken(id) {
    jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function createAndSendToken(user, statusCode, _req, res) {
    const token = signToken(user._id);
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + ninetyDays),
        httpOnly: true,
        // secure: true,
        sameSite: 'none',
    });
    // remove password from output
    user.password = '';
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
}
exports.signup = (0, catchAsync_1.default)(async (req, res, _next) => {
    const { name, password } = req.body;
    const existingUser = await userModel_1.default.find({ name: { $eq: name } });
    if (existingUser.length)
        return (0, sendErrorJson_1.default)(res, 'That email is already taken', 401);
    if (password.length < 8)
        return (0, sendErrorJson_1.default)(res, 'Password must be at least 8 charachters', 400);
    const newUser = await userModel_1.default.create({ name, password });
    createAndSendToken(newUser, 201, req, res);
});
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, password } = req.body;
    // Expirementing with using next(sendErrorJson)
    if (!name || !password)
        return next((0, sendErrorJson_1.default)(res, 'Please provide an name and password', 400));
    const user = await userModel_1.default.findOne({ name }).select('+password');
    const passwordIsCorrect = user && (await user.correctPassword(password));
    if (!user || !passwordIsCorrect)
        return (0, sendErrorJson_1.default)(res, 'Incorrect name or password', 401);
    createAndSendToken(user, 200, req, res);
});
