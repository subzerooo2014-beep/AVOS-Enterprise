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
exports.ProductionHardeningV8MegaPack1Controller = void 0;
const common_1 = require("@nestjs/common");
const create_adaptive_policy_dto_1 = require("./dto/create-adaptive-policy.dto");
const create_digital_twin_dto_1 = require("./dto/create-digital-twin.dto");
const create_governance_rule_dto_1 = require("./dto/create-governance-rule.dto");
const create_prediction_dto_1 = require("./dto/create-prediction.dto");
const create_runtime_node_dto_1 = require("./dto/create-runtime-node.dto");
const execute_twin_scenario_dto_1 = require("./dto/execute-twin-scenario.dto");
const record_runtime_metrics_dto_1 = require("./dto/record-runtime-metrics.dto");
const production_hardening_v8_mega_pack_1_service_1 = require("./production-hardening-v8-mega-pack-1.service");
let ProductionHardeningV8MegaPack1Controller = class ProductionHardeningV8MegaPack1Controller {
    constructor(service) {
        this.service = service;
    }
    status() {
        return {
            success: true,
            system: "AVOS Production Hardening V8 — Mega Pack 1",
            version: "v8-mega-pack-1",
            ...this.service.getSnapshot(),
        };
    }
    snapshot() {
        return {
            success: true,
            snapshot: this.service.getSnapshot(),
        };
    }
    verify() {
        const snapshot = this.service.getSnapshot();
        const checks = {
            runtimeFoundationReady: snapshot.runtimeNodes > 0 &&
                snapshot.healthyRuntimeNodes > 0,
            runtimeMetricsReady: snapshot.metricSamples > 0,
            adaptiveRuntimeReady: snapshot.adaptivePolicies > 0 &&
                snapshot.activeAdaptivePolicies > 0 &&
                snapshot.runtimeAdaptations > 0 &&
                snapshot.completedAdaptations > 0,
            predictiveOperationsReady: snapshot.predictions > 0 &&
                snapshot.mitigatedPredictions > 0,
            digitalTwinReady: snapshot.digitalTwins > 0 &&
                snapshot.synchronizedDigitalTwins > 0,
            simulationReady: snapshot.digitalTwinScenarios > 0 &&
                snapshot.resilientScenarios > 0,
            autonomousGovernanceReady: snapshot.governanceRules > 0 &&
                snapshot.activeGovernanceRules > 0 &&
                snapshot.governanceEvaluations > 0,
            noCriticalRuntimeNodes: snapshot.criticalRuntimeNodes === 0,
            noFailedAdaptations: snapshot.failedAdaptations === 0,
            noDeniedGovernanceEvaluations: snapshot.deniedGovernanceEvaluations === 0,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            platformEventsReady: snapshot.platformEvents > 0,
        };
        return {
            success: Object.values(checks).every(Boolean),
            system: "AVOS Production Hardening V8 — Mega Pack 1",
            version: "v8-mega-pack-1",
            healthStatus: snapshot.healthStatus,
            evidenceChainVerified: snapshot.evidenceChainVerified,
            checks,
            snapshot,
        };
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
    createRuntimeNode(dto) {
        return {
            success: true,
            runtimeNode: this.service.createRuntimeNode(dto, "api"),
        };
    }
    listRuntimeNodes() {
        return {
            success: true,
            runtimeNodes: this.service.listRuntimeNodes(),
        };
    }
    getRuntimeNode(nodeId) {
        return {
            success: true,
            runtimeNode: this.service.getRuntimeNode(nodeId),
        };
    }
    recordRuntimeMetrics(nodeId, dto) {
        return {
            success: true,
            metricSample: this.service.recordRuntimeMetrics(nodeId, dto, "api"),
        };
    }
    listMetricSamples(nodeId) {
        return {
            success: true,
            metricSamples: this.service.listMetricSamples(nodeId),
        };
    }
    createAdaptivePolicy(dto) {
        return {
            success: true,
            policy: this.service.createAdaptivePolicy(dto, "api"),
        };
    }
    listAdaptivePolicies() {
        return {
            success: true,
            policies: this.service.listAdaptivePolicies(),
        };
    }
    evaluateAdaptivePolicies(nodeId) {
        return {
            success: true,
            adaptations: this.service.evaluateAdaptivePolicies(nodeId, "api"),
        };
    }
    executeAdaptation(adaptationId) {
        return {
            success: true,
            adaptation: this.service.executeAdaptation(adaptationId, "api"),
        };
    }
    listAdaptations() {
        return {
            success: true,
            adaptations: this.service.listAdaptations(),
        };
    }
    createPrediction(nodeId, dto) {
        return {
            success: true,
            prediction: this.service.createPrediction(nodeId, dto, "api"),
        };
    }
    mitigatePrediction(predictionId) {
        return {
            success: true,
            prediction: this.service.mitigatePrediction(predictionId, "api"),
        };
    }
    listPredictions() {
        return {
            success: true,
            predictions: this.service.listPredictions(),
        };
    }
    createDigitalTwin(dto) {
        return {
            success: true,
            digitalTwin: this.service.createDigitalTwin(dto, "api"),
        };
    }
    listDigitalTwins() {
        return {
            success: true,
            digitalTwins: this.service.listDigitalTwins(),
        };
    }
    getDigitalTwin(digitalTwinId) {
        return {
            success: true,
            digitalTwin: this.service.getDigitalTwin(digitalTwinId),
        };
    }
    synchronizeDigitalTwin(digitalTwinId) {
        return {
            success: true,
            digitalTwin: this.service.synchronizeDigitalTwin(digitalTwinId, "api"),
        };
    }
    executeTwinScenario(digitalTwinId, dto) {
        return {
            success: true,
            scenario: this.service.executeTwinScenario(digitalTwinId, dto, "api"),
        };
    }
    listDigitalTwinScenarios() {
        return {
            success: true,
            scenarios: this.service.listDigitalTwinScenarios(),
        };
    }
    createGovernanceRule(dto) {
        return {
            success: true,
            rule: this.service.createGovernanceRule(dto, "api"),
        };
    }
    listGovernanceRules() {
        return {
            success: true,
            rules: this.service.listGovernanceRules(),
        };
    }
    evaluateGovernance(nodeId, decision, confidencePercent) {
        return {
            success: true,
            evaluation: this.service.evaluateGovernance(nodeId, decision, confidencePercent === undefined
                ? 100
                : Number(confidencePercent), "api"),
        };
    }
    listGovernanceEvaluations() {
        return {
            success: true,
            evaluations: this.service.listGovernanceEvaluations(),
        };
    }
};
exports.ProductionHardeningV8MegaPack1Controller = ProductionHardeningV8MegaPack1Controller;
__decorate([
    (0, common_1.Get)("status"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "status", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "snapshot", null);
__decorate([
    (0, common_1.Get)("verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "verify", null);
__decorate([
    (0, common_1.Get)("evidence/verify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "verifyEvidence", null);
__decorate([
    (0, common_1.Get)("evidence"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "evidence", null);
__decorate([
    (0, common_1.Get)("events"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "events", null);
__decorate([
    (0, common_1.Post)("runtime-nodes"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runtime_node_dto_1.CreateRuntimeNodeDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "createRuntimeNode", null);
__decorate([
    (0, common_1.Get)("runtime-nodes"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listRuntimeNodes", null);
__decorate([
    (0, common_1.Get)("runtime-nodes/:nodeId"),
    __param(0, (0, common_1.Param)("nodeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "getRuntimeNode", null);
__decorate([
    (0, common_1.Post)("runtime-nodes/:nodeId/metrics"),
    __param(0, (0, common_1.Param)("nodeId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_runtime_metrics_dto_1.RecordRuntimeMetricsDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "recordRuntimeMetrics", null);
__decorate([
    (0, common_1.Get)("metric-samples"),
    __param(0, (0, common_1.Query)("nodeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listMetricSamples", null);
__decorate([
    (0, common_1.Post)("adaptive-policies"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_adaptive_policy_dto_1.CreateAdaptivePolicyDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "createAdaptivePolicy", null);
__decorate([
    (0, common_1.Get)("adaptive-policies"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listAdaptivePolicies", null);
__decorate([
    (0, common_1.Post)("runtime-nodes/:nodeId/evaluate-adaptation"),
    __param(0, (0, common_1.Param)("nodeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "evaluateAdaptivePolicies", null);
__decorate([
    (0, common_1.Post)("runtime-adaptations/:adaptationId/execute"),
    __param(0, (0, common_1.Param)("adaptationId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "executeAdaptation", null);
__decorate([
    (0, common_1.Get)("runtime-adaptations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listAdaptations", null);
__decorate([
    (0, common_1.Post)("runtime-nodes/:nodeId/predictions"),
    __param(0, (0, common_1.Param)("nodeId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_prediction_dto_1.CreatePredictionDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "createPrediction", null);
__decorate([
    (0, common_1.Post)("predictions/:predictionId/mitigate"),
    __param(0, (0, common_1.Param)("predictionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "mitigatePrediction", null);
__decorate([
    (0, common_1.Get)("predictions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listPredictions", null);
__decorate([
    (0, common_1.Post)("digital-twins"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_digital_twin_dto_1.CreateDigitalTwinDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "createDigitalTwin", null);
__decorate([
    (0, common_1.Get)("digital-twins"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listDigitalTwins", null);
__decorate([
    (0, common_1.Get)("digital-twins/:digitalTwinId"),
    __param(0, (0, common_1.Param)("digitalTwinId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "getDigitalTwin", null);
__decorate([
    (0, common_1.Post)("digital-twins/:digitalTwinId/synchronize"),
    __param(0, (0, common_1.Param)("digitalTwinId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "synchronizeDigitalTwin", null);
__decorate([
    (0, common_1.Post)("digital-twins/:digitalTwinId/scenarios"),
    __param(0, (0, common_1.Param)("digitalTwinId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, execute_twin_scenario_dto_1.ExecuteTwinScenarioDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "executeTwinScenario", null);
__decorate([
    (0, common_1.Get)("digital-twin-scenarios"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listDigitalTwinScenarios", null);
__decorate([
    (0, common_1.Post)("governance-rules"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_governance_rule_dto_1.CreateGovernanceRuleDto]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "createGovernanceRule", null);
__decorate([
    (0, common_1.Get)("governance-rules"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listGovernanceRules", null);
__decorate([
    (0, common_1.Post)("runtime-nodes/:nodeId/governance/:decision"),
    __param(0, (0, common_1.Param)("nodeId")),
    __param(1, (0, common_1.Param)("decision")),
    __param(2, (0, common_1.Query)("confidencePercent")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "evaluateGovernance", null);
__decorate([
    (0, common_1.Get)("governance-evaluations"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductionHardeningV8MegaPack1Controller.prototype, "listGovernanceEvaluations", null);
exports.ProductionHardeningV8MegaPack1Controller = ProductionHardeningV8MegaPack1Controller = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-1"),
    __metadata("design:paramtypes", [production_hardening_v8_mega_pack_1_service_1.ProductionHardeningV8MegaPack1Service])
], ProductionHardeningV8MegaPack1Controller);
//# sourceMappingURL=production-hardening-v8-mega-pack-1.controller.js.map