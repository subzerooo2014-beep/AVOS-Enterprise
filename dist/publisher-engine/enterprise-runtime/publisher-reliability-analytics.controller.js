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
exports.PublisherReliabilityAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const publisher_reliability_analytics_service_1 = require("./publisher-reliability-analytics.service");
let PublisherReliabilityAnalyticsController = class PublisherReliabilityAnalyticsController {
    constructor(service) {
        this.service = service;
    }
    sla(dateFrom, dateTo, channel) {
        return this.service.slaReport({
            dateFrom,
            dateTo,
            channel,
        });
    }
    failures(dateFrom, dateTo, channel) {
        return this.service.failureTrends({
            dateFrom,
            dateTo,
            channel,
        });
    }
    ranking(dateFrom, dateTo) {
        return this.service.reliabilityRanking({
            dateFrom,
            dateTo,
        });
    }
    latency(dateFrom, dateTo, channel) {
        return this.service.latencyDistribution({
            dateFrom,
            dateTo,
            channel,
        });
    }
};
exports.PublisherReliabilityAnalyticsController = PublisherReliabilityAnalyticsController;
__decorate([
    (0, common_1.Get)("sla"),
    __param(0, (0, common_1.Query)("dateFrom")),
    __param(1, (0, common_1.Query)("dateTo")),
    __param(2, (0, common_1.Query)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublisherReliabilityAnalyticsController.prototype, "sla", null);
__decorate([
    (0, common_1.Get)("failures"),
    __param(0, (0, common_1.Query)("dateFrom")),
    __param(1, (0, common_1.Query)("dateTo")),
    __param(2, (0, common_1.Query)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublisherReliabilityAnalyticsController.prototype, "failures", null);
__decorate([
    (0, common_1.Get)("ranking"),
    __param(0, (0, common_1.Query)("dateFrom")),
    __param(1, (0, common_1.Query)("dateTo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PublisherReliabilityAnalyticsController.prototype, "ranking", null);
__decorate([
    (0, common_1.Get)("latency"),
    __param(0, (0, common_1.Query)("dateFrom")),
    __param(1, (0, common_1.Query)("dateTo")),
    __param(2, (0, common_1.Query)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PublisherReliabilityAnalyticsController.prototype, "latency", null);
exports.PublisherReliabilityAnalyticsController = PublisherReliabilityAnalyticsController = __decorate([
    (0, common_1.Controller)("publisher-engine/enterprise/reliability"),
    __metadata("design:paramtypes", [publisher_reliability_analytics_service_1.PublisherReliabilityAnalyticsService])
], PublisherReliabilityAnalyticsController);
//# sourceMappingURL=publisher-reliability-analytics.controller.js.map