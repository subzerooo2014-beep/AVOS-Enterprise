"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeMetricsService = void 0;
const common_1 = require("@nestjs/common");
let RuntimeMetricsService = class RuntimeMetricsService {
    async getMetrics() {
        const memory = process.memoryUsage();
        const cpu = process.cpuUsage();
        const sampledDelayMs = await this.sampleEventLoopDelay();
        const heapUsagePercent = memory.heapTotal > 0
            ? (memory.heapUsed / memory.heapTotal) * 100
            : 0;
        return {
            timestamp: new Date().toISOString(),
            uptimeSeconds: Number(process.uptime().toFixed(3)),
            processId: process.pid,
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            memory: {
                rssBytes: memory.rss,
                heapTotalBytes: memory.heapTotal,
                heapUsedBytes: memory.heapUsed,
                externalBytes: memory.external,
                arrayBuffersBytes: memory.arrayBuffers,
                heapUsagePercent: Number(heapUsagePercent.toFixed(2)),
            },
            cpu: {
                userMicroseconds: cpu.user,
                systemMicroseconds: cpu.system,
            },
            eventLoop: {
                sampledDelayMs,
                status: sampledDelayMs >= 250 ? "degraded" : "healthy",
            },
        };
    }
    async sampleEventLoopDelay() {
        const startedAt = process.hrtime.bigint();
        await new Promise((resolve) => {
            setImmediate(resolve);
        });
        const elapsed = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
        return Number(elapsed.toFixed(3));
    }
};
exports.RuntimeMetricsService = RuntimeMetricsService;
exports.RuntimeMetricsService = RuntimeMetricsService = __decorate([
    (0, common_1.Injectable)()
], RuntimeMetricsService);
//# sourceMappingURL=runtime-metrics.service.js.map