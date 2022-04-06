"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendErrorJson(res, message, statusCode) {
    res.status(statusCode).json({
        status: statusCode.toString().startsWith('4') ? 'fail' : 'error',
        data: { message },
    });
}
exports.default = sendErrorJson;
