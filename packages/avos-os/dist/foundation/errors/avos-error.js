"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosError = void 0;
class AvosError extends Error {
    code;
    details;
    constructor(message, code = "AVOS_ERROR", details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = "AvosError";
    }
}
exports.AvosError = AvosError;
