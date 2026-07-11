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
exports.ProductionHardeningV7MegaPack8Controller = void 0;
const common_1 = require("@nestjs/common");
const production_hardening_v7_mega_pack_8_dto_1 = require("./production-hardening-v7-mega-pack-8.dto");
const production_hardening_v7_mega_pack_8_service_1 = require("./production-hardening-v7-mega-pack-8.service");
let ProductionHardeningV7MegaPack8Controller = class ProductionHardeningV7MegaPack8Controller {
    constructor(service) {
        this.service = service;
    }
    getStatus() {
        return this.service.getStatus();
    }
    getSnapshot() {
        return this.service.getSnapshot();
    }
    verifyEvidence() {
        return this.service.verifyEvidenceChain();
    }
    listConfigurations() {
        return this.service.listConfigurations();
    }
    createConfiguration(dto) {
        return this.service.createConfiguration(dto);
    }
    approveConfiguration(configurationId, dto) {
        return this.service.approveConfiguration(configurationId, dto);
    }
    rollbackConfiguration(configurationId, dto) {
        return this.service.rollbackConfiguration(configurationId, dto);
    }
    listPolicies() {
        return this.service.listPolicies();
    }
    createPolicy(dto) {
        return this.service.createPolicy(dto);
    }
    createBaseline(dto) {
        return this.service.createBaseline(dto);
    }
    scanDrift(baselineId) {
        return this.service.scanDrift(baselineId);
    }
    createFeatureFlag(dto) {
        return this.service.createFeatureFlag(dto);
    }
    updateFeatureFlag(flagId, dto) {
        return this.service.updateFeatureFlag(flagId, dto);
    }
    evaluateFeatureFlag(flagId, userId, service) {
        return this.service.evaluateFeatureFlag(flagId, {
            userId,
            service,
        });
    }
    createKillSwitch(dto) {
        return this.service.createKillSwitch(dto);
    }
    activateKillSwitch(switchId, dto) {
        return this.service.activateKillSwitch(switchId, dto);
    }
    releaseKillSwitch(switchId, dto) {
        return this.service.releaseKillSwitch(switchId, dto);
    }
};
exports.ProductionHardeningV7MegaPack8Controller = ProductionHardeningV7MegaPack8Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("configurations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "listConfigurations", null);
__decorate([
    (0, common_1.Post)("configurations"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_dto_1.CreateConfigurationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "createConfiguration", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/approval"),
    __param(0, (0, common_1.Param)("configurationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_8_dto_1.ApproveConfigurationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "approveConfiguration", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/rollback"),
    __param(0, (0, common_1.Param)("configurationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_8_dto_1.RollbackConfigurationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "rollbackConfiguration", null);
__decorate([
    (0, common_1.Get)("policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "listPolicies", null);
__decorate([
    (0, common_1.Post)("policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_dto_1.CreatePolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "createPolicy", null);
__decorate([
    (0, common_1.Post)("baselines"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_dto_1.CreateBaselineDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "createBaseline", null);
__decorate([
    (0, common_1.Post)("baselines/:baselineId/scan"),
    __param(0, (0, common_1.Param)("baselineId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "scanDrift", null);
__decorate([
    (0, common_1.Post)("feature-flags"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_dto_1.CreateFeatureFlagDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "createFeatureFlag", null);
__decorate([
    (0, common_1.Put)("feature-flags/:flagId"),
    __param(0, (0, common_1.Param)("flagId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_8_dto_1.UpdateFeatureFlagDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "updateFeatureFlag", null);
__decorate([
    (0, common_1.Get)("feature-flags/:flagId/evaluate"),
    __param(0, (0, common_1.Param)("flagId")),
    __param(1, (0, common_1.Query)("userId")),
    __param(2, (0, common_1.Query)("service")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "evaluateFeatureFlag", null);
__decorate([
    (0, common_1.Post)("kill-switches"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_dto_1.CreateKillSwitchDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "createKillSwitch", null);
__decorate([
    (0, common_1.Post)("kill-switches/:switchId/activate"),
    __param(0, (0, common_1.Param)("switchId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_8_dto_1.ActivateKillSwitchDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "activateKillSwitch", null);
__decorate([
    (0, common_1.Post)("kill-switches/:switchId/release"),
    __param(0, (0, common_1.Param)("switchId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, production_hardening_v7_mega_pack_8_dto_1.ReleaseKillSwitchDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack8Controller.prototype, "releaseKillSwitch", null);
exports.ProductionHardeningV7MegaPack8Controller = ProductionHardeningV7MegaPack8Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-8"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_8_service_1.ProductionHardeningV7MegaPack8Service])
], ProductionHardeningV7MegaPack8Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-8.controller.js.map