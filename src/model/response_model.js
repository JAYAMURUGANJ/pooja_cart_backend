// Create a response model
const responseModel = function (statusCode, status, data, message) {
    this.status_code = statusCode;
    this.status = status;
    this.data = data;
    this.message = message;
};

module.exports = {
    responseModel
};