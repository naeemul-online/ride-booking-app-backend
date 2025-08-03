"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerCastError = void 0;
const handlerCastError = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
err) => {
    return {
        statusCode: 400,
        message: "Invalid mongodb objectID. Please provide a valid ID",
    };
};
exports.handlerCastError = handlerCastError;
