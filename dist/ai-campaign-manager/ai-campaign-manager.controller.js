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
exports.AiCampaignManagerController = void 0;
const common_1 = require("@nestjs/common");
const ai_campaign_manager_service_1 = require("./ai-campaign-manager.service");
let AiCampaignManagerController = class AiCampaignManagerController {
    constructor(service) {
        this.service = service;
    }
    generate(vehicleId, body) {
        return this.service.generatePlan(vehicleId, body);
    }
    generateAndSave(vehicleId, body) {
        return this.service.generateAndSave(vehicleId, body);
    }
    history(vehicleId, limit) {
        return this.service.history(vehicleId, limit
            ? Number(limit)
            : 20);
    }
    plan(eventId) {
        return this.service.plan(eventId);
    }
    lifecycle(eventId) {
        return this.service.lifecycle(eventId);
    }
    submit(eventId, body) {
        return this.service.submitForApproval(eventId, body?.note);
    }
    approve(eventId, body) {
        return this.service.approve(eventId, body);
    }
    reject(eventId, body) {
        return this.service.reject(eventId, body);
    }
    cancel(eventId, body) {
        return this.service.cancel(eventId, body);
    }
};
exports.AiCampaignManagerController = AiCampaignManagerController;
__decorate([
    (0, common_1.Post)("generate/:vehicleId"),
    __param(0, (0, common_1.Param)("vehicleId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)("generate-save/:vehicleId"),
    __param(0, (0, common_1.Param)("vehicleId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "generateAndSave", null);
__decorate([
    (0, common_1.Get)("history/:vehicleId"),
    __param(0, (0, common_1.Param)("vehicleId")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "history", null);
__decorate([
    (0, common_1.Get)("plan/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "plan", null);
__decorate([
    (0, common_1.Get)("lifecycle/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "lifecycle", null);
__decorate([
    (0, common_1.Post)("submit/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)("approve/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)("reject/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)("cancel/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignManagerController.prototype, "cancel", null);
exports.AiCampaignManagerController = AiCampaignManagerController = __decorate([
    (0, common_1.Controller)("ai-campaign-manager"),
    __metadata("design:paramtypes", [ai_campaign_manager_service_1.AiCampaignManagerService])
], AiCampaignManagerController);
//# sourceMappingURL=ai-campaign-manager.controller.js.map