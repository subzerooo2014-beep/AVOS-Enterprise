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
exports.PublisherQueueRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const publisher_queue_monitor_service_1 = require("./publisher-queue-monitor.service");
const publisher_priority_queue_service_1 = require("./publisher-priority-queue.service");
let PublisherQueueRuntimeService = class PublisherQueueRuntimeService {
    constructor(monitor, queue) {
        this.monitor = monitor;
        this.queue = queue;
    }
    async runtime(limit = 20) {
        return {
            monitor: await this.monitor.summary(),
            queued: await this.queue.next(limit),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherQueueRuntimeService = PublisherQueueRuntimeService;
exports.PublisherQueueRuntimeService = PublisherQueueRuntimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_queue_monitor_service_1.PublisherQueueMonitorService,
        publisher_priority_queue_service_1.PublisherPriorityQueueService])
], PublisherQueueRuntimeService);
//# sourceMappingURL=publisher-queue-runtime.service.js.map