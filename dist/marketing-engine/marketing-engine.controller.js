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
exports.MarketingEngineController = void 0;
const common_1 = require("@nestjs/common");
const marketing_engine_service_1 = require("./marketing-engine.service");
let MarketingEngineController = class MarketingEngineController {
    constructor(service) {
        this.service = service;
    }
    createCampaign(body) {
        return this.service.createCampaign(body);
    }
    listCampaigns() {
        return this.service.listCampaigns();
    }
    findCampaign(id) {
        return this.service.findCampaign(id);
    }
    generateAd(id, body) {
        return this.service.generateAd(id, body);
    }
    optimize(id, body) {
        return this.service.optimizeCampaign(id, body);
    }
    publishingPlan(id, body) {
        return this.service.createPublishingPlan(id, body);
    }
};
exports.MarketingEngineController = MarketingEngineController;
__decorate([
    (0, common_1.Post)("campaigns"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Get)("campaigns"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "listCampaigns", null);
__decorate([
    (0, common_1.Get)("campaigns/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "findCampaign", null);
__decorate([
    (0, common_1.Post)("campaigns/:id/generate-ad"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "generateAd", null);
__decorate([
    (0, common_1.Post)("campaigns/:id/optimize"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "optimize", null);
__decorate([
    (0, common_1.Post)("campaigns/:id/publishing-plan"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingEngineController.prototype, "publishingPlan", null);
exports.MarketingEngineController = MarketingEngineController = __decorate([
    (0, common_1.Controller)("marketing-engine"),
    __metadata("design:paramtypes", [marketing_engine_service_1.MarketingEngineService])
], MarketingEngineController);
//# sourceMappingURL=marketing-engine.controller.js.map