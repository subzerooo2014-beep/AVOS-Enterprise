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
exports.PublisherReportService = void 0;
const common_1 = require("@nestjs/common");
const publisher_statistics_service_1 = require("./publisher-statistics.service");
const publisher_performance_service_1 = require("./publisher-performance.service");
const publisher_channel_metrics_service_1 = require("./publisher-channel-metrics.service");
let PublisherReportService = class PublisherReportService {
    constructor(statistics, performance, channels) {
        this.statistics = statistics;
        this.performance = performance;
        this.channels = channels;
    }
    async report() {
        return {
            success: true,
            statistics: await this.statistics.summary(),
            performance: await this.performance.report(),
            channels: await this.channels.summary(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherReportService = PublisherReportService;
exports.PublisherReportService = PublisherReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_statistics_service_1.PublisherStatisticsService,
        publisher_performance_service_1.PublisherPerformanceService,
        publisher_channel_metrics_service_1.PublisherChannelMetricsService])
], PublisherReportService);
//# sourceMappingURL=publisher-report.service.js.map