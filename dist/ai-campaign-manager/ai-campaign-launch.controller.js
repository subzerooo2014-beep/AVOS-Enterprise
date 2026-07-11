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
exports.AiCampaignLaunchController = void 0;
const common_1 = require("@nestjs/common");
const ai_campaign_launch_service_1 = require("./ai-campaign-launch.service");
let AiCampaignLaunchController = class AiCampaignLaunchController {
    constructor(service) {
        this.service = service;
    }
    validate(eventId, body) {
        return this.service.validate(eventId, body?.channels);
    }
    launch(eventId, body) {
        return this.service.launch(eventId, body);
    }
    retryFailed(eventId, body) {
        return this.service.retryFailed(eventId, body?.launchedBy);
    }
    summary(eventId) {
        return this.service.launchSummary(eventId);
    }
    progress(eventId) {
        return this.service.progress(eventId);
    }
};
exports.AiCampaignLaunchController = AiCampaignLaunchController;
__decorate([
    (0, common_1.Post)("validate/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignLaunchController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)("execute/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignLaunchController.prototype, "launch", null);
__decorate([
    (0, common_1.Post)("retry-failed/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AiCampaignLaunchController.prototype, "retryFailed", null);
__decorate([
    (0, common_1.Get)("summary/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiCampaignLaunchController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)("progress/:eventId"),
    __param(0, (0, common_1.Param)("eventId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiCampaignLaunchController.prototype, "progress", null);
exports.AiCampaignLaunchController = AiCampaignLaunchController = __decorate([
    (0, common_1.Controller)("ai-campaign-manager/launch"),
    __metadata("design:paramtypes", [ai_campaign_launch_service_1.AiCampaignLaunchService])
], AiCampaignLaunchController);
//# sourceMappingURL=ai-campaign-launch.controller.js.map