// utils/responseHelper.js
const { responseModel } = require("../model/responseModel");

const successResponse = (res, { data = [], message = "Success", statusCode = 200 } = {}) => {
    return res.status(statusCode).json(new responseModel(statusCode, true, data, message));
};

const failureResponse = (res, { message = "Something went wrong", statusCode = 500 }) => {
    // Check if the error message contains "ER_DUP_ENTRY"
    if (message.includes("ER_DUP_ENTRY")) {
        statusCode = 400; // Set Bad Request status
        message = "Duplicate entry. This record already exists.";
    }

    res.status(statusCode).json(new responseModel(statusCode, "failure", [], message));
};

module.exports = { successResponse, failureResponse };
