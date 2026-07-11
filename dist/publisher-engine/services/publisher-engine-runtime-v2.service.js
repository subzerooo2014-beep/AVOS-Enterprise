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
exports.PublisherEngineRuntimeV2Service = void 0;
const common_1 = require("@nestjs/common");
const publisher_runtime_dashboard_service_1 = require("./publisher-runtime-dashboard.service");
const publisher_queue_runtime_service_1 = require("./publisher-queue-runtime.service");
let PublisherEngineRuntimeV2Service = class PublisherEngineRuntimeV2Service {
    constructor(dashboard, queue) {
        this.dashboard = dashboard;
        this.queue = queue;
    }
    async status() {
        return {
            success: true,
            dashboard: this.dashboard.dashboard(),
            queue: await this.queue.runtime(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEngineRuntimeV2Service = PublisherEngineRuntimeV2Service;
exports.PublisherEngineRuntimeV2Service = PublisherEngineRuntimeV2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_runtime_dashboard_service_1.PublisherRuntimeDashboardService,
        publisher_queue_runtime_service_1.PublisherQueueRuntimeService])
], PublisherEngineRuntimeV2Service);
//# sourceMappingURL=publisher-engine-runtime-v2.service.js.map