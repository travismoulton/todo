"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['put origin here'],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
}));
// Development logging
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
// Set security http headers
app.use((0, helmet_1.default)());
// Data sanitiziation against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
app.use(express_1.default.json());
app.use('/users', userRoutes_1.default);
exports.default = app;
