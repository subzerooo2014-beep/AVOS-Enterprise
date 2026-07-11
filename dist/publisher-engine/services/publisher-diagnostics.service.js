"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherDiagnosticsService = void 0;
const common_1 = require("@nestjs/common");
const publisher_health_monitor_service_1 = require("./publisher-health-monitor.service");
const publisher_queue_monitor_service_1 = require("./publisher-queue-monitor.service");
let PublisherDiagnosticsService = class PublisherDiagnosticsService {
    constructor(health, queue) {
        this.health = health;
        this.queue = queue;
    }
    async diagnostics() {
        return {
            success: true,
            health: await this.health.status(),
            queue: await this.queue.summary(),
            checkedAt: new Date(),
        };
    }
};
exports.PublisherDiagnosticsService = PublisherDiagnosticsService;
exports.PublisherDiagnosticsService = PublisherDiagnosticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_health_monitor_service_1.PublisherHealthMonitorService,
        publisher_queue_monitor_service_1.PublisherQueueMonitorService])
], PublisherDiagnosticsService);
//# sourceMappingURL=publisher-diagnostics.service.js.map