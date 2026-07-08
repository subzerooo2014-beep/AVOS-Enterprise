"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWorker = void 0;
const bullmq_1 = require("bullmq");
exports.defaultWorker = new bullmq_1.Worker("default", async (job) => {
    return {
        processed: true,
        id: job.id,
    };
}, {
    connection: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    },
});
//# sourceMappingURL=default.worker.js.map