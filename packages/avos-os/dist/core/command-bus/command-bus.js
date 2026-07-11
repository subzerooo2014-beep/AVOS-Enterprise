"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosCommandBus = void 0;
const avos_logger_1 = require("../../foundation/logger/avos-logger");
const avos_error_1 = require("../../foundation/errors/avos-error");
class AvosCommandBus {
    handlers = [];
    logger = new avos_logger_1.AvosLogger("CommandBus");
    register(handler) {
        this.handlers.push(handler);
    }
    async execute(command) {
        if (!command.type) {
            throw new avos_error_1.AvosError("Command type is required", "COMMAND_TYPE_REQUIRED");
        }
        const handler = this.handlers.find((h) => h.supports(command));
        if (!handler) {
            this.logger.warn("No Command Handler", command.type);
            return {
                status: "skipped",
                reason: "NO_HANDLER",
                commandType: command.type,
            };
        }
        this.logger.info("Executing Command", command.type);
        return {
            status: "success",
            data: await handler.handle(command),
        };
    }
}
exports.AvosCommandBus = AvosCommandBus;
