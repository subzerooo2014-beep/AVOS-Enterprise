"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosCommandBus = void 0;
const avos_error_1 = require("../errors/avos-error");
const avos_logger_1 = require("../logger/avos-logger");
class AvosCommandBus {
    handlers = [];
    logger = new avos_logger_1.AvosLogger("CommandBus");
    register(handler) {
        this.handlers.push(handler);
    }
    async execute(command) {
        if (!command?.type) {
            throw new avos_error_1.AvosError("Command type is required", "COMMAND_TYPE_REQUIRED");
        }
        const handler = this.handlers.find((item) => item.supports(command));
        if (!handler) {
            this.logger.warn("No handler registered", { type: command.type });
            return {
                status: "skipped",
                metadata: {
                    reason: "NO_HANDLER",
                    commandType: command.type,
                },
            };
        }
        this.logger.info("Executing command", { type: command.type });
        const data = await handler.handle(command);
        return {
            status: "success",
            data,
        };
    }
}
exports.AvosCommandBus = AvosCommandBus;
