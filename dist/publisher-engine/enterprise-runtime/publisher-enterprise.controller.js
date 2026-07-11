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
exports.PublisherEnterpriseController = void 0;
const common_1 = require("@nestjs/common");
const publisher_enterprise_service_1 = require("./publisher-enterprise.service");
let PublisherEnterpriseController = class PublisherEnterpriseController {
    constructor(service) {
        this.service = service;
    }
    deliveries(channel, status, vehicleId, correlationId, dateFrom, dateTo, limit) {
        return this.service.deliveries({
            channel,
            status,
            vehicleId,
            correlationId,
            dateFrom,
            dateTo,
            limit: limit
                ? Number(limit)
                : 50,
        });
    }
    timeline(eventId) {
        return this.service.timeline(eventId);
    }
    snapshot(eventId) {
        return this.service.snapshot(eventId);
    }
    analytics() {
        return this.service.analytics();
    }
};
exports.PublisherEnterpriseController = PublisherEnterpriseController;
__decorate([
    (0, common_1.Get)("deliveries"),
    __param(0, (0, common_1.Query)("channel")),
    __param(1, (0, common_1.Query)("status")),
    __param(2, (0, common_1.Query)("vehicleId")),
    __param(3, (0, common_1.Query)("correlationId")),
    __param(4, (0, common_1.Query)("dateFrom")),
    __param(5, (0, common_1.Query)("dateTo")),
    __param(6, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PublisherEnterpriseController.prototype, "deliveries", null);
__decorate([
    (0, common_1.Get)("timeline/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEnterpriseController.prototype, "timeline", null);
__decorate([
    (0, common_1.Get)("snapshot/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublisherEnterpriseController.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("analytics"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherEnterpriseController.prototype, "analytics", null);
exports.PublisherEnterpriseController = PublisherEnterpriseController = __decorate([
    (0, common_1.Controller)("publisher-engine/enterprise"),
    __metadata("design:paramtypes", [publisher_enterprise_service_1.PublisherEnterpriseService])
], PublisherEnterpriseController);
//# sourceMappingURL=publisher-enterprise.controller.js.map