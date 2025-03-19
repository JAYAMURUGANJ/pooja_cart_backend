// Create a response model
const responseModel = function (statusCode, status, data, message, pagination = null) {
    this.status_code = statusCode;
    this.status = status;
    this.data = Array.isArray(data) ? data : data ? [data] : [];
    this.message = message;
    if (pagination) this.pagination = pagination; // Add pagination only if available
};

module.exports = {
    responseModel
};
