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
exports.PublisherEngineMetricsService = void 0;
const common_1 = require("@nestjs/common");
const publisher_dispatch_metrics_service_1 = require("./publisher-dispatch-metrics.service");
const publisher_channel_metrics_service_1 = require("./publisher-channel-metrics.service");
const publisher_worker_metrics_service_1 = require("./publisher-worker-metrics.service");
let PublisherEngineMetricsService = class PublisherEngineMetricsService {
    constructor(dispatch, channels, workers) {
        this.dispatch = dispatch;
        this.channels = channels;
        this.workers = workers;
    }
    async metrics() {
        return {
            dispatch: this.dispatch.report(),
            channels: await this.channels.summary(),
            workers: await this.workers.summary(),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEngineMetricsService = PublisherEngineMetricsService;
exports.PublisherEngineMetricsService = PublisherEngineMetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_dispatch_metrics_service_1.PublisherDispatchMetricsService,
        publisher_channel_metrics_service_1.PublisherChannelMetricsService,
        publisher_worker_metrics_service_1.PublisherWorkerMetricsService])
], PublisherEngineMetricsService);
//# sourceMappingURL=publisher-engine-metrics.service.js.map