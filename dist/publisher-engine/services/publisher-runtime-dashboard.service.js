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
exports.PublisherRuntimeDashboardService = void 0;
const common_1 = require("@nestjs/common");
const publisher_worker_health_service_1 = require("./publisher-worker-health.service");
const publisher_execution_log_service_1 = require("./publisher-execution-log.service");
let PublisherRuntimeDashboardService = class PublisherRuntimeDashboardService {
    constructor(workers, logs) {
        this.workers = workers;
        this.logs = logs;
    }
    dashboard() {
        return {
            workers: this.workers.health(),
            executions: this.logs.latest(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherRuntimeDashboardService = PublisherRuntimeDashboardService;
exports.PublisherRuntimeDashboardService = PublisherRuntimeDashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_worker_health_service_1.PublisherWorkerHealthService,
        publisher_execution_log_service_1.PublisherExecutionLogService])
], PublisherRuntimeDashboardService);
//# sourceMappingURL=publisher-runtime-dashboard.service.js.map