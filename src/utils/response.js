class Response {
    constructor(statusCode, data, message, success = "true") {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
    }
}

export {
    Response,
}