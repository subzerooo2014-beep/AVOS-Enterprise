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
exports.ProductionHardeningV7MegaPack12Controller = void 0;
const common_1 = require("@nestjs/common");
const create_slo_dto_1 = require("./dto/create-slo.dto");
const create_traffic_policy_dto_1 = require("./dto/create-traffic-policy.dto");
const execute_protection_dto_1 = require("./dto/execute-protection.dto");
const generate_capacity_forecast_dto_1 = require("./dto/generate-capacity-forecast.dto");
const record_metric_sample_dto_1 = require("./dto/record-metric-sample.dto");
const production_hardening_v7_mega_pack_12_service_1 = require("./production-hardening-v7-mega-pack-12.service");
let ProductionHardeningV7MegaPack12Controller = class ProductionHardeningV7MegaPack12Controller {
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
    createSlo(dto) {
        return {
            success: true,
            slo: this.service.createSlo(dto, "api"),
        };
    }
    listSlos() {
        return {
            success: true,
            slos: this.service.listSlos(),
        };
    }
    getSlo(sloId) {
        return {
            success: true,
            slo: this.service.getSlo(sloId),
        };
    }
    activateSlo(sloId) {
        return {
            success: true,
            slo: this.service.activateSlo(sloId, "api"),
        };
    }
    recordMetricSample(dto) {
        return {
            success: true,
            sample: this.service.recordMetricSample(dto, "api"),
        };
    }
    listMetricSamples(sloId) {
        return {
            success: true,
            samples: this.service.listMetricSamples(sloId),
        };
    }
    evaluateSlo(sloId) {
        return {
            success: true,
            evaluation: this.service.evaluateSlo(sloId, undefined, "api"),
        };
    }
    listEvaluations(sloId) {
        return {
            success: true,
            evaluations: this.service.listEvaluations(sloId),
        };
    }
    calculateErrorBudget(sloId) {
        return {
            success: true,
            errorBudget: this.service.calculateErrorBudget(sloId, "api"),
        };
    }
    listErrorBudgets() {
        return {
            success: true,
            errorBudgets: this.service.listErrorBudgets(),
        };
    }
    generateCapacityForecast(dto) {
        return {
            success: true,
            forecast: this.service.generateCapacityForecast(dto, "api"),
        };
    }
    listCapacityForecasts() {
        return {
            success: true,
            forecasts: this.service.listCapacityForecasts(),
        };
    }
    createTrafficPolicy(dto) {
        return {
            success: true,
            policy: this.service.createTrafficPolicy(dto, "api"),
        };
    }
    listTrafficPolicies() {
        return {
            success: true,
            policies: this.service.listTrafficPolicies(),
        };
    }
    activateTrafficPolicy(policyId) {
        return {
            success: true,
            policy: this.service.activateTrafficPolicy(policyId, "api"),
        };
    }
    executeProtection(policyId, dto) {
        return {
            success: true,
            execution: this.service.executeProtection(policyId, dto, "api"),
        };
    }
    listProtectionExecutions() {
        return {
            success: true,
            executions: this.service.listProtectionExecutions(),
        };
    }
    listReliabilityDecisions() {
        return {
            success: true,
            decisions: this.service.listReliabilityDecisions(),
        };
    }
};
exports.ProductionHardeningV7MegaPack12Controller = ProductionHardeningV7MegaPack12Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("slos"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_slo_dto_1.CreateSloDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "createSlo", null);
__decorate([
    (0, common_1.Get)("slos"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listSlos", null);
__decorate([
    (0, common_1.Get)("slos/:sloId"),
    __param(0, (0, common_1.Param)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "getSlo", null);
__decorate([
    (0, common_1.Post)("slos/:sloId/activate"),
    __param(0, (0, common_1.Param)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "activateSlo", null);
__decorate([
    (0, common_1.Post)("metric-samples"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [record_metric_sample_dto_1.RecordMetricSampleDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "recordMetricSample", null);
__decorate([
    (0, common_1.Get)("metric-samples"),
    __param(0, (0, common_1.Query)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listMetricSamples", null);
__decorate([
    (0, common_1.Post)("slos/:sloId/evaluate"),
    __param(0, (0, common_1.Param)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "evaluateSlo", null);
__decorate([
    (0, common_1.Get)("slo-evaluations"),
    __param(0, (0, common_1.Query)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listEvaluations", null);
__decorate([
    (0, common_1.Post)("slos/:sloId/error-budget"),
    __param(0, (0, common_1.Param)("sloId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "calculateErrorBudget", null);
__decorate([
    (0, common_1.Get)("error-budgets"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listErrorBudgets", null);
__decorate([
    (0, common_1.Post)("capacity-forecasts"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_capacity_forecast_dto_1.GenerateCapacityForecastDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "generateCapacityForecast", null);
__decorate([
    (0, common_1.Get)("capacity-forecasts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listCapacityForecasts", null);
__decorate([
    (0, common_1.Post)("traffic-policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_traffic_policy_dto_1.CreateTrafficPolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "createTrafficPolicy", null);
__decorate([
    (0, common_1.Get)("traffic-policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listTrafficPolicies", null);
__decorate([
    (0, common_1.Post)("traffic-policies/:policyId/activate"),
    __param(0, (0, common_1.Param)("policyId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "activateTrafficPolicy", null);
__decorate([
    (0, common_1.Post)("traffic-policies/:policyId/execute"),
    __param(0, (0, common_1.Param)("policyId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_protection_dto_1.ExecuteProtectionDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "executeProtection", null);
__decorate([
    (0, common_1.Get)("protection-executions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listProtectionExecutions", null);
__decorate([
    (0, common_1.Get)("reliability-decisions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV7MegaPack12Controller.prototype, "listReliabilityDecisions", null);
exports.ProductionHardeningV7MegaPack12Controller = ProductionHardeningV7MegaPack12Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v7-mega-pack-12"),
    __metadata("design:paramtypes", [production_hardening_v7_mega_pack_12_service_1.ProductionHardeningV7MegaPack12Service])
], ProductionHardeningV7MegaPack12Controller);
//# sourceMappingURL=production-hardening-v7-mega-pack-12.controller.js.map