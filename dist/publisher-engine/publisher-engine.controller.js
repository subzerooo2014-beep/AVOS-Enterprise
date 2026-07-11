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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherEngineController = void 0;
const common_1 = require("@nestjs/common");
const publisher_dispatcher_service_1 = require("./publisher-dispatcher.service");
const publisher_registry_service_1 = require("./publisher-registry.service");
const publisher_metrics_service_1 = require("./services/publisher-metrics.service");
const publisher_stats_service_1 = require("./services/publisher-stats.service");
const publisher_job_admin_service_1 = require("./services/publisher-job-admin.service");
const publisher_dashboard_service_1 = require("./services/publisher-dashboard.service");
const publisher_preview_service_1 = require("./services/publisher-preview.service");
const publisher_simulation_service_1 = require("./services/publisher-simulation.service");
const publisher_unlock_service_1 = require("./services/publisher-unlock.service");
const create_publish_job_dto_1 = require("./dto/create-publish-job.dto");
const publisher_query_dto_1 = require("./dto/publisher-query.dto");
let PublisherEngineController = class PublisherEngineController {
    constructor(dispatcher, registry, metrics, stats, admin, dashboardService, previewService, simulationService, unlockService) {
        this.dispatcher = dispatcher;
        this.registry = registry;
        this.metrics = metrics;
        this.stats = stats;
        this.admin = admin;
        this.dashboardService = dashboardService;
        this.previewService = previewService;
        this.simulationService = simulationService;
        this.unlockService = unlockService;
    }
    channels() {
        return { success: true, version: "v2", channels: this.registry.list() };
    }
    health() {
        return this.dispatcher.health();
    }
    metricsSummary() {
        return this.metrics.summary();
    }
    channelStats() {
        return this.stats.byChannel();
    }
    dashboard() {
        return this.dashboardService.dashboard();
    }
    jobs(query) {
        return this.admin.list(query);
    }
    job(id) {
        return this.admin.get(id);
    }
    publish(body) {
        return this.admin.create(body);
    }
    publishMany(body) {
        return this.admin.createMany(Array.isArray(body?.items) ? body.items : []);
    }
    dispatchQueued(limit) {
        return this.dispatcher.dispatchQueued(limit ? Number(limit) : 20);
    }
    dispatchOne(id) {
        return this.dispatcher.dispatchOne(id);
    }
    retry(id) {
        return this.admin.retry(id);
    }
    retryFailed(limit) {
        return this.admin.retryFailed(limit ? Number(limit) : 50);
    }
    cancel(id) {
        return this.admin.cancel(id);
    }
    preview(body) {
        return this.previewService.preview(body);
    }
    simulate(body) {
        return this.simulationService.simulate(body);
    }
    unlockExpired(minutes) {
        return this.unlockService.unlockExpired(minutes ? Number(minutes) : 10);
    }
};
exports.PublisherEngineController = PublisherEngineController;
__decorate([
    (0, common_1.Get)("channels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "channels", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "health", null);
__decorate([
    (0, common_1.Get)("metrics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "metricsSummary", null);
__decorate([
    (0, common_1.Get)("stats/channels"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "channelStats", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("jobs"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [publisher_query_dto_1.PublisherQueryDto]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "jobs", null);
__decorate([
    (0, common_1.Get)("job/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "job", null);
__decorate([
    (0, common_1.Post)("publish"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publish_job_dto_1.CreatePublishJobDto]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "publish", null);
__decorate([
    (0, common_1.Post)("publish-many"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publish_job_dto_1.CreatePublishJobsBatchDto]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "publishMany", null);
__decorate([
    (0, common_1.Post)("dispatch-queued"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "dispatchQueued", null);
__decorate([
    (0, common_1.Post)("dispatch/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "dispatchOne", null);
__decorate([
    (0, common_1.Post)("retry/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "retry", null);
__decorate([
    (0, common_1.Post)("retry-failed"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "retryFailed", null);
__decorate([
    (0, common_1.Post)("cancel/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)("preview"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)("simulate"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "simulate", null);
__decorate([
    (0, common_1.Post)("unlock-expired"),
    __param(0, (0, common_1.Query)("minutes")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEngineController.prototype, "unlockExpired", null);
exports.PublisherEngineController = PublisherEngineController = __decorate([
    (0, common_1.Controller)("publisher-engine"),
    __metadata("design:paramtypes", [publisher_dispatcher_service_1.PublisherDispatcherService,
        publisher_registry_service_1.PublisherRegistryService,
        publisher_metrics_service_1.PublisherMetricsService,
        publisher_stats_service_1.PublisherStatsService,
        publisher_job_admin_service_1.PublisherJobAdminService,
        publisher_dashboard_service_1.PublisherDashboardService,
        publisher_preview_service_1.PublisherPreviewService,
        publisher_simulation_service_1.PublisherSimulationService,
        publisher_unlock_service_1.PublisherUnlockService])
], PublisherEngineController);
//# sourceMappingURL=publisher-engine.controller.js.map