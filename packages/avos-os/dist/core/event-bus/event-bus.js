"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosEventBus = void 0;
const avos_logger_1 = require("../../foundation/logger/avos-logger");
const avos_error_1 = require("../../foundation/errors/avos-error");
class AvosEventBus {
    handlers = [];
    logger = new avos_logger_1.AvosLogger("EventBus");
    register(handler) {
        this.handlers.push(handler);
    }
    async publish(event) {
        if (!event.type) {
            throw new avos_error_1.AvosError("Event type is required", "EVENT_TYPE_REQUIRED");
        }
        const handlers = this.handlers.filter((handler) => handler.supports(event));
        if (handlers.length === 0) {
            this.logger.warn("No Event Handlers", event.type);
            return {
                status: "skipped",
                reason: "NO_HANDLER",
                eventType: event.type,
            };
        }
        for (const handler of handlers) {
            await handler.handle(event);
        }
        return {
            status: "success",
            handlers: handlers.length,
            eventType: event.type,
        };
    }
}
exports.AvosEventBus = AvosEventBus;
