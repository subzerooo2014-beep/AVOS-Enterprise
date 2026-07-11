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
exports.PublisherEngineSummaryService = void 0;
const common_1 = require("@nestjs/common");
const publisher_engine_metrics_service_1 = require("./publisher-engine-metrics.service");
const publisher_ready_service_1 = require("./publisher-ready.service");
let PublisherEngineSummaryService = class PublisherEngineSummaryService {
    constructor(metrics, ready) {
        this.metrics = metrics;
        this.ready = ready;
    }
    async summary() {
        return {
            ready: this.ready.ready(),
            metrics: await this.metrics.metrics(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEngineSummaryService = PublisherEngineSummaryService;
exports.PublisherEngineSummaryService = PublisherEngineSummaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_engine_metrics_service_1.PublisherEngineMetricsService,
        publisher_ready_service_1.PublisherReadyService])
], PublisherEngineSummaryService);
//# sourceMappingURL=publisher-engine-summary.service.js.map