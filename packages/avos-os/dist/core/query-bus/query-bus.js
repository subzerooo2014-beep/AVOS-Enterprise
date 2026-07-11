"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosQueryBus = void 0;
const avos_logger_1 = require("../../foundation/logger/avos-logger");
const avos_error_1 = require("../../foundation/errors/avos-error");
class AvosQueryBus {
    handlers = [];
    logger = new avos_logger_1.AvosLogger("QueryBus");
    register(handler) {
        this.handlers.push(handler);
    }
    async execute(query) {
        if (!query.type) {
            throw new avos_error_1.AvosError("Query type is required", "QUERY_TYPE_REQUIRED");
        }
        const handler = this.handlers.find(h => h.supports(query));
        if (!handler) {
            this.logger.warn("No Query Handler", query.type);
            return {
                status: "skipped",
                reason: "NO_HANDLER",
                queryType: query.type
            };
        }
        this.logger.info("Executing Query", query.type);
        return {
            status: "success",
            data: await handler.handle(query)
        };
    }
}
exports.AvosQueryBus = AvosQueryBus;
