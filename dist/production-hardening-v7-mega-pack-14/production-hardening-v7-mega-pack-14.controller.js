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
exports.ProductionHardeningV7MegaPack14Controller = void 0;
const common_1 = require("@nestjs/common");
const create_feature_flag_dto_1 = require("./dto/create-feature-flag.dto");
const create_runtime_configuration_dto_1 = require("./dto/create-runtime-configuration.dto");
const create_runtime_health_rule_dto_1 = require("./dto/create-runtime-health-rule.dto");
const create_runtime_policy_dto_1 = require("./dto/create-runtime-policy.dto");
const detect_configuration_drift_dto_1 = require("./dto/detect-configuration-drift.dto");
const evaluate_feature_flag_dto_1 = require("./dto/evaluate-feature-flag.dto");
const evaluate_runtime_health_dto_1 = require("./dto/evaluate-runtime-health.dto");
const start_configuration_rollout_dto_1 = require("./dto/start-configuration-rollout.dto");
const production_hardening_v7_mega_pack_14_service_1 = require("./production-hardening-v7-mega-pack-14.service");
let ProductionHardeningV7MegaPack14Controller = class ProductionHardeningV7MegaPack14Controller {
    constructor(service) {
        this.service = service;
    }
    status() {
        return this.service.getStatus();
    }
    snapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        return this.service.runVerification();
    }
    verifyEvidence() {
        return {
            success: true,
            ...this.service.verifyEvidenceChain(),
        };
    }
    evidence() {
        return {
            success: true,
            entries: this.service.listEvidenceEntries(),
        };
    }
    events() {
        return {
            success: true,
            events: this.service.listPlatformEvents(),
        };
    }
    createConfiguration(dto) {
        return {
            success: true,
            configuration: this.service.createConfiguration(dto, "api"),
        };
    }
    listConfigurations() {
        return {
            success: true,
            configurations: this.service.listConfigurations(),
        };
    }
    getConfiguration(configurationId) {
        return {
            success: true,
            configuration: this.service.getConfiguration(configurationId),
        };
    }
    requestApproval(configurationId) {
        return {
            success: true,
            approval: this.service.requestConfigurationApproval(configurationId, "api"),
        };
    }
    approveConfiguration(approvalId) {
        return {
            success: true,
            approval: this.service.approveConfiguration(approvalId, "api"),
        };
    }
    listApprovals() {
        return {
            success: true,
            approvals: this.service.listApprovals(),
        };
    }
    startRollout(configurationId, dto) {
        return {
            success: true,
            rollout: this.service.startRollout(configurationId, dto),
        };
    }
    rollbackConfiguration(configurationId) {
        return {
            success: true,
            configuration: this.service.rollbackConfiguration(configurationId, "api"),
        };
    }
    listRollouts() {
        return {
            success: true,
            rollouts: this.service.listRollouts(),
        };
    }
    createFeatureFlag(dto) {
        return {
            success: true,
            featureFlag: this.service.createFeatureFlag(dto, "api"),
        };
    }
    listFeatureFlags() {
        return {
            success: true,
            featureFlags: this.service.listFeatureFlags(),
        };
    }
    activateFeatureFlag(featureFlagId) {
        return {
            success: true,
            featureFlag: this.service.activateFeatureFlag(featureFlagId, "api"),
        };
    }
    evaluateFeatureFlag(featureFlagId, dto) {
        return {
            success: true,
            evaluation: this.service.evaluateFeatureFlag(featureFlagId, dto, "api"),
        };
    }
    listFeatureEvaluations() {
        return {
            success: true,
            evaluations: this.service.listFeatureEvaluations(),
        };
    }
    detectConfigurationDrift(dto) {
        return {
            success: true,
            drift: this.service.detectConfigurationDrift(dto, "api"),
        };
    }
    remediateConfigurationDrift(driftId) {
        return {
            success: true,
            drift: this.service.remediateConfigurationDrift(driftId, "api"),
        };
    }
    listConfigurationDrifts() {
        return {
            success: true,
            drifts: this.service.listDrifts(),
        };
    }
    createRuntimePolicy(dto) {
        return {
            success: true,
            policy: this.service.createRuntimePolicy(dto, "api"),
        };
    }
    listRuntimePolicies() {
        return {
            success: true,
            policies: this.service.listRuntimePolicies(),
        };
    }
    evaluateRuntimePolicy(configurationId) {
        return {
            success: true,
            evaluation: this.service.evaluateRuntimePolicy(configurationId, "api"),
        };
    }
    listPolicyEvaluations() {
        return {
            success: true,
            evaluations: this.service.listPolicyEvaluations(),
        };
    }
    createHealthRule(dto) {
        return {
            success: true,
            rule: this.service.createHealthRule(dto, "api"),
        };
    }
    listHealthRules() {
        return {
            success: true,
            rules: this.service.listHealthRules(),
        };
    }
    evaluateHealthRule(ruleId, dto) {
        return {
            success: true,
            evaluation: this.service.evaluateHealthRule(ruleId, dto, "api"),
        };
    }
    listHealthEvaluations() {
        return {
            success: true,
            evaluations: this.service.listHealthEvaluations(),
        };
    }
};
exports.ProductionHardeningV7MegaPack14Controller = ProductionHardeningV7MegaPack14Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("configurations"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runtime_configuration_dto_1.CreateRuntimeConfigurationDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "createConfiguration", null);
__decorate([
    (0, common_1.Get)("configurations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listConfigurations", null);
__decorate([
    (0, common_1.Get)("configurations/:configurationId"),
    __param(0, (0, common_1.Param)("configurationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "getConfiguration", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/request-approval"),
    __param(0, (0, common_1.Param)("configurationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "requestApproval", null);
__decorate([
    (0, common_1.Post)("approvals/:approvalId/approve"),
    __param(0, (0, common_1.Param)("approvalId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "approveConfiguration", null);
__decorate([
    (0, common_1.Get)("approvals"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listApprovals", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/rollout"),
    __param(0, (0, common_1.Param)("configurationId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, start_configuration_rollout_dto_1.StartConfigurationRolloutDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "startRollout", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/rollback"),
    __param(0, (0, common_1.Param)("configurationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "rollbackConfiguration", null);
__decorate([
    (0, common_1.Get)("rollouts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listRollouts", null);
__decorate([
    (0, common_1.Post)("feature-flags"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_feature_flag_dto_1.CreateFeatureFlagDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "createFeatureFlag", null);
__decorate([
    (0, common_1.Get)("feature-flags"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listFeatureFlags", null);
__decorate([
    (0, common_1.Post)("feature-flags/:featureFlagId/activate"),
    __param(0, (0, common_1.Param)("featureFlagId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "activateFeatureFlag", null);
__decorate([
    (0, common_1.Post)("feature-flags/:featureFlagId/evaluate"),
    __param(0, (0, common_1.Param)("featureFlagId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluate_feature_flag_dto_1.EvaluateFeatureFlagDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "evaluateFeatureFlag", null);
__decorate([
    (0, common_1.Get)("feature-evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listFeatureEvaluations", null);
__decorate([
    (0, common_1.Post)("configuration-drifts/detect"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [detect_configuration_drift_dto_1.DetectConfigurationDriftDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "detectConfigurationDrift", null);
__decorate([
    (0, common_1.Post)("configuration-drifts/:driftId/remediate"),
    __param(0, (0, common_1.Param)("driftId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "remediateConfigurationDrift", null);
__decorate([
    (0, common_1.Get)("configuration-drifts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listConfigurationDrifts", null);
__decorate([
    (0, common_1.Post)("runtime-policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runtime_policy_dto_1.CreateRuntimePolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "createRuntimePolicy", null);
__decorate([
    (0, common_1.Get)("runtime-policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listRuntimePolicies", null);
__decorate([
    (0, common_1.Post)("configurations/:configurationId/evaluate-policy"),
    __param(0, (0, common_1.Param)("configurationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "evaluateRuntimePolicy", null);
__decorate([
    (0, common_1.Get)("policy-evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listPolicyEvaluations", null);
__decorate([
    (0, common_1.Post)("health-rules"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runtime_health_rule_dto_1.CreateRuntimeHealthRuleDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "createHealthRule", null);
__decorate([
    (0, common_1.Get)("health-rules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listHealthRules", null);
__decorate([
    (0, common_1.Post)("health-rules/:ruleId/evaluate"),
    __param(0, (0, common_1.Param)("ruleId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, evaluate_runtime_health_dto_1.EvaluateRuntimeHealthDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "evaluateHealthRule", null);
__decorate([
    (0, common_1.Get)("health-evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack14Controller.prototype, "listHealthEvaluations", null);
exports.ProductionHardeningV7MegaPack14Controller = ProductionHardeningV7MegaPack14Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-14"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_14_service_1.ProductionHardeningV7MegaPack14Service])
], ProductionHardeningV7MegaPack14Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-14.controller.js.map