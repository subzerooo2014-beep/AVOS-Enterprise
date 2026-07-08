"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueue = void 0;
const bullmq_1 = require("bullmq");
exports.aiQueue = new bullmq_1.Queue("ai-jobs", {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    },
});
//# sourceMappingURL=ai.queue.js.map