const AppError = require("../../utils/AppError");

describe("AppError", () => {
    test("sets statusCode and status correctly for 404", () => {
        const error = new AppError("Not found", 404);

        expect(error.statusCode).toBe(404);
        expect(error.status).toBe("fail");
    });

    test("sets status to error for 500", () => {
        const error = new AppError("Server error", 500);

        expect(error.status).toBe("error");
    });

    test("isOperational defaults to true", () => {
        const error = new AppError("Something went wrong", 400);

        expect(error.isOperational).toBe(true);
    });

    test("is an instance of native Error", () => {
        const error = new AppError("Not found", 404);

        expect(error).toBeInstanceOf(Error);
    });
});