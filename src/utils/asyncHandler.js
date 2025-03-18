// utils/asyncHandler.js
const { failureResponse } = require("./responseHelper");

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            failureResponse(res, { message: err.message, statusCode: err.statusCode || 500 });
        });
    };
};

module.exports = asyncHandler;
