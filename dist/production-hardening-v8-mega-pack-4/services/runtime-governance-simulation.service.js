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
exports.RuntimeGovernanceSimulationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_governance_request_service_1 = require("./runtime-governance-request.service");
let RuntimeGovernanceSimulationService = class RuntimeGovernanceSimulationService {
    constructor(store, requests) {
        this.store = store;
        this.requests = requests;
    }
    simulate(requestId, dto) {
        const request = this.requests.get(requestId);
        const startedAt = new Date().toISOString();
        const simulation = {
            id: (0, crypto_1.randomUUID)(),
            requestId: request.id,
            status: contracts_1.GovernanceSimulationStatus.RUNNING,
            scenario: {
                id: (0, crypto_1.randomUUID)(),
                name: dto.scenarioName,
                description: dto.description,
                changes: dto.changes,
                assumptions: (dto.assumptions ?? {}),
            },
            predictedDecision: request.decision ??
                (0, utils_1.governanceDecisionFromRisk)(request.requestedRiskLevel),
            predictedRiskLevel: request.evaluatedRiskLevel ??
                request.requestedRiskLevel,
            predictedRiskScore: request.riskScore ?? 0,
            findings: [],
            recommendations: [],
            startedAt,
        };
        this.store.saveSimulation(simulation);
        try {
            const score = this.calculateScenarioRisk(request.blastRadius ?? 30, request.businessCriticality ?? 40, request.testCoverage ?? 50, request.rollbackPlanAvailable, dto.changes, dto.assumptions ?? {});
            const riskLevel = (0, utils_1.governanceRiskFromScore)(score);
            const findings = this.buildFindings(request.id, score, dto.changes);
            simulation.predictedRiskScore =
                score;
            simulation.predictedRiskLevel =
                riskLevel;
            simulation.predictedDecision =
                (0, utils_1.governanceDecisionFromRisk)(riskLevel);
            simulation.findings =
                findings;
            simulation.recommendations =
                this.buildRecommendations(riskLevel, findings);
            simulation.status =
                contracts_1.GovernanceSimulationStatus.COMPLETED;
            simulation.completedAt =
                new Date().toISOString();
            return this.store.saveSimulation(simulation);
        }
        catch (error) {
            simulation.status =
                contracts_1.GovernanceSimulationStatus.FAILED;
            simulation.failedAt =
                new Date().toISOString();
            simulation.error =
                error instanceof Error
                    ? error.message
                    : "Unknown simulation failure";
            return this.store.saveSimulation(simulation);
        }
    }
    list() {
        return this.store
            .listSimulations();
    }
    get(id) {
        const item = this.store.getSimulation(id);
        if (!item) {
            throw new common_1.NotFoundException(`Governance simulation ${id} was not found`);
        }
        return item;
    }
    calculateScenarioRisk(blastRadius, businessCriticality, testCoverage, rollbackPlanAvailable, changes, assumptions) {
        const deploymentScale = Number(changes.deploymentScale ??
            assumptions.deploymentScale ??
            1);
        const dependencyCount = Number(changes.dependencyCount ??
            assumptions.dependencyCount ??
            0);
        const securitySensitive = Boolean(changes.securitySensitive ??
            assumptions.securitySensitive ??
            false);
        const dataMigration = Boolean(changes.dataMigration ??
            assumptions.dataMigration ??
            false);
        const score = blastRadius * 0.2 +
            businessCriticality * 0.2 +
            (100 - testCoverage) * 0.2 +
            (rollbackPlanAvailable ? 5 : 25) +
            Math.min(15, deploymentScale * 3) +
            Math.min(10, dependencyCount * 2) +
            (securitySensitive ? 10 : 0) +
            (dataMigration ? 10 : 0);
        return (0, utils_1.clampGovernanceScore)(score);
    }
    buildFindings(requestId, riskScore, changes) {
        const findings = [];
        if (Number(changes.deploymentScale ?? 1) >= 3) {
            findings.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.SERVICE,
                severity: contracts_1.GovernanceRiskLevel.HIGH,
                title: "Wide deployment scale detected",
                description: "The simulated deployment affects multiple runtime units.",
                affectedResourceIds: [
                    requestId,
                ],
                confidence: 94,
                metadata: {
                    deploymentScale: Number(changes.deploymentScale ??
                        1),
                },
            });
        }
        if (Boolean(changes.securitySensitive)) {
            findings.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.SECURITY,
                severity: contracts_1.GovernanceRiskLevel.HIGH,
                title: "Security-sensitive change",
                description: "The scenario includes security-sensitive modifications.",
                affectedResourceIds: [
                    requestId,
                ],
                confidence: 98,
                metadata: {},
            });
        }
        if (Boolean(changes.dataMigration)) {
            findings.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.DATA,
                severity: contracts_1.GovernanceRiskLevel.HIGH,
                title: "Data migration impact",
                description: "The scenario contains data migration risk.",
                affectedResourceIds: [
                    requestId,
                ],
                confidence: 97,
                metadata: {},
            });
        }
        if (riskScore >= 65) {
            findings.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.BUSINESS,
                severity: (0, utils_1.governanceRiskFromScore)(riskScore),
                title: "Elevated scenario risk",
                description: "The simulated scenario exceeds the elevated-risk threshold.",
                affectedResourceIds: [
                    requestId,
                ],
                confidence: 96,
                metadata: {
                    riskScore,
                },
            });
        }
        return findings;
    }
    buildRecommendations(riskLevel, findings) {
        const recommendations = [];
        if (riskLevel ===
            contracts_1.GovernanceRiskLevel.HIGH ||
            riskLevel ===
                contracts_1.GovernanceRiskLevel.CRITICAL) {
            recommendations.push("Require senior governance approval");
            recommendations.push("Execute within a restricted maintenance window");
            recommendations.push("Validate rollback plan before execution");
        }
        if (findings.some((finding) => finding.category ===
            contracts_1.GovernanceImpactCategory.DATA)) {
            recommendations.push("Create a verified data backup before execution");
        }
        if (findings.some((finding) => finding.category ===
            contracts_1.GovernanceImpactCategory.SECURITY)) {
            recommendations.push("Require security review and enhanced monitoring");
        }
        if (recommendations.length === 0) {
            recommendations.push("Proceed with standard governance monitoring");
        }
        return Array.from(new Set(recommendations));
    }
};
exports.RuntimeGovernanceSimulationService = RuntimeGovernanceSimulationService;
exports.RuntimeGovernanceSimulationService = RuntimeGovernanceSimulationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_request_service_1.RuntimeGovernanceRequestService])
], RuntimeGovernanceSimulationService);
//# sourceMappingURL=runtime-governance-simulation.service.js.map