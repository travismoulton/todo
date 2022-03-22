"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!, Shutting donw...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
const { DATABASE, DB_PASSWORD, PORT } = process.env;
const DB = DATABASE === null || DATABASE === void 0 ? void 0 : DATABASE.replace('<password>', DB_PASSWORD);
mongoose_1.default.connect(DB).then(() => {
    console.log('DB connection successful');
});
const port = PORT || '8080';
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION, SHUTTING DOWN...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Proccess terminated');
    });
});
