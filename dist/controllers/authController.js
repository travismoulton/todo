"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfUserIsLoggedIn = exports.protectRoute = exports.logout = exports.login = exports.signup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const sendErrorJson_1 = __importDefault(require("../utils/sendErrorJson"));
dotenv_1.default.config({ path: './config.env' });
const { JWT_EXPIRES_IN, JWT_SECRET } = process.env;
function signToken(id) {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
function createAndSendToken(user, statusCode, _req, res) {
    const token = signToken(user._id);
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + ninetyDays),
        httpOnly: true,
        secure: true,
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
    // Will return an array if one user if found
    const existingUser = await userModel_1.default.find({ name: { $eq: name } });
    if (existingUser.length)
        return (0, sendErrorJson_1.default)(res, 'That email is already taken', 400);
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
const logout = (_req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        // secure: true
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
exports.protectRoute = (0, catchAsync_1.default)(async (req, res, next) => {
    var _a, _b, _c;
    // Check for to see if bearer token or jwt exist
    const isBearerToken = !!((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer'));
    const tokenIsCookie = !!((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.jwt);
    const token = isBearerToken
        ? (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1]
        : tokenIsCookie
            ? req.cookies.jwt
            : null;
    console.log({ token });
    console.log(req.cookies);
    if (!token) {
        return (0, sendErrorJson_1.default)(res, 'You are not logged in! Please log in to get access', 401);
    }
    // Verify the token
    const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    // Check if the user still exists
    const currentUser = await userModel_1.default.findById(decodedToken.id);
    if (!currentUser) {
        return next((0, sendErrorJson_1.default)(res, 'The user belonging to this token no longer exists', 401));
    }
    req.user = currentUser;
    console.log(req.user);
    next();
});
exports.checkIfUserIsLoggedIn = (0, catchAsync_1.default)(async (req, res, _next) => {
    var _a;
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
    console.log(token);
    const sendNoUserResponse = () => res.status(204).json({ status: 'No user found' });
    if (token && token !== 'loggedout') {
        // Verify the token
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const currentUser = await userModel_1.default.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        if (!currentUser)
            sendNoUserResponse();
        // All checks passed
        res.status(200).json({ status: 'Success', data: { user: currentUser } });
    }
    else {
        sendNoUserResponse();
    }
});
