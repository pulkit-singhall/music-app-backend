class ApiError extends Error{
    constructor(statusCode, message, success = "false") {
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
    }
}

export {
    ApiError,
}