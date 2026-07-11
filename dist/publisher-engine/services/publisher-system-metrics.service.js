"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherSystemMetricsService = void 0;
const common_1 = require("@nestjs/common");
let PublisherSystemMetricsService = class PublisherSystemMetricsService {
    metrics() {
        const memory = process.memoryUsage();
        return {
            pid: process.pid,
            uptime: process.uptime(),
            rss: memory.rss,
            heapUsed: memory.heapUsed,
            heapTotal: memory.heapTotal,
            external: memory.external,
            node: process.version,
            platform: process.platform,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherSystemMetricsService = PublisherSystemMetricsService;
exports.PublisherSystemMetricsService = PublisherSystemMetricsService = __decorate([
    (0, common_1.Injectable)()
], PublisherSystemMetricsService);
//# sourceMappingURL=publisher-system-metrics.service.js.map