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
exports.AiDistributionEngineController = void 0;
const common_1 = require("@nestjs/common");
const ai_distribution_engine_service_1 = require("./ai-distribution-engine.service");
let AiDistributionEngineController = class AiDistributionEngineController {
    constructor(service) {
        this.service = service;
    }
    dashboard() {
        return this.service.dashboard();
    }
    processQueued(limit) {
        return this.service.processQueued(limit ? Number(limit) : 20);
    }
    retryFailed(limit) {
        return this.service.retryFailed(limit ? Number(limit) : 20);
    }
    channelReport(channel) {
        return this.service.channelReport(channel);
    }
    vehicleReport(id) {
        return this.service.vehicleReport(id);
    }
};
exports.AiDistributionEngineController = AiDistributionEngineController;
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiDistributionEngineController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Post)("process-queued"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiDistributionEngineController.prototype, "processQueued", null);
__decorate([
    (0, common_1.Post)("retry-failed"),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiDistributionEngineController.prototype, "retryFailed", null);
__decorate([
    (0, common_1.Get)("channel/:channel"),
    __param(0, (0, common_1.Param)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiDistributionEngineController.prototype, "channelReport", null);
__decorate([
    (0, common_1.Get)("vehicle/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiDistributionEngineController.prototype, "vehicleReport", null);
exports.AiDistributionEngineController = AiDistributionEngineController = __decorate([
    (0, common_1.Controller)("ai-distribution-engine"),
    __metadata("design:paramtypes", [ai_distribution_engine_service_1.AiDistributionEngineService])
], AiDistributionEngineController);
//# sourceMappingURL=ai-distribution-engine.controller.js.map