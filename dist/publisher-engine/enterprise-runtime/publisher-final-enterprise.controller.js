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
exports.PublisherFinalEnterpriseController = void 0;
const common_1 = require("@nestjs/common");
const publisher_final_enterprise_service_1 = require("./publisher-final-enterprise.service");
let PublisherFinalEnterpriseController = class PublisherFinalEnterpriseController {
    constructor(service) {
        this.service = service;
    }
    live() {
        return this.service.liveMetrics();
    }
    health() {
        return this.service.operationsHealth();
    }
    executiveSummary() {
        return this.service.executiveSummary();
    }
    productionReadiness() {
        return this.service.productionReadiness();
    }
    report() {
        return this.service.finalReport();
    }
};
exports.PublisherFinalEnterpriseController = PublisherFinalEnterpriseController;
__decorate([
    (0, common_1.Get)("live"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherFinalEnterpriseController.prototype, "live", null);
__decorate([
    (0, common_1.Get)("health"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherFinalEnterpriseController.prototype, "health", null);
__decorate([
    (0, common_1.Get)("executive-summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherFinalEnterpriseController.prototype, "executiveSummary", null);
__decorate([
    (0, common_1.Get)("production-readiness"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherFinalEnterpriseController.prototype, "productionReadiness", null);
__decorate([
    (0, common_1.Get)("report"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublisherFinalEnterpriseController.prototype, "report", null);
exports.PublisherFinalEnterpriseController = PublisherFinalEnterpriseController = __decorate([
    (0, common_1.Controller)("publisher-engine/enterprise/final"),
    __metadata("design:paramtypes", [publisher_final_enterprise_service_1.PublisherFinalEnterpriseService])
], PublisherFinalEnterpriseController);
//# sourceMappingURL=publisher-final-enterprise.controller.js.map