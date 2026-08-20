const asyncHandler = require("../../utils/asyncHandler");

describe("asyncHandler", () => {
    test("calls the wrapped controller with req, res, and next", async () => {
        const controller = jest.fn();

        const wrappedController = asyncHandler(controller);

        const req = {};
        const res = {};
        const next = jest.fn();

        wrappedController(req, res, next);

        await new Promise(setImmediate);

        expect(controller).toHaveBeenCalledWith(req, res, next);
    });

    test("passes rejected errors to next", async () => {
        const error = new Error("Something went wrong");

        const controller = jest.fn().mockRejectedValue(error);

        const wrappedController = asyncHandler(controller);

        const req = {};
        const res = {};
        const next = jest.fn();

        wrappedController(req, res, next);

        // Give the rejected promise a chance to resolve
        await new Promise(setImmediate);

        expect(next).toHaveBeenCalledWith(error);
    });

    test("passes thrown errors to next", async () => {
        const error = new Error("Controller failed");

        const controller = jest.fn().mockImplementation(() => {
            throw error;
        });

        const wrappedController = asyncHandler(controller);

        const req = {};
        const res = {};
        const next = jest.fn();

        wrappedController(req, res, next);

        await new Promise(setImmediate);

        expect(next).toHaveBeenCalledWith(error);
    });
});