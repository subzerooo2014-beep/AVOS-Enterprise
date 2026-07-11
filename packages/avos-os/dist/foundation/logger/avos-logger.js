"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosLogger = void 0;
class AvosLogger {
    scope;
    constructor(scope = "AVOS") {
        this.scope = scope;
    }
    info(message, data) {
        console.log(`[${this.scope}] INFO: ${message}`, data ?? "");
    }
    warn(message, data) {
        console.warn(`[${this.scope}] WARN: ${message}`, data ?? "");
    }
    error(message, data) {
        console.error(`[${this.scope}] ERROR: ${message}`, data ?? "");
    }
}
exports.AvosLogger = AvosLogger;
