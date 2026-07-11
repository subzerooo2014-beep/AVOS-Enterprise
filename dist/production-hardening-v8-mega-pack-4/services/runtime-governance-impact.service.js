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
exports.RuntimeGovernanceImpactService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_governance_request_service_1 = require("./runtime-governance-request.service");
let RuntimeGovernanceImpactService = class RuntimeGovernanceImpactService {
    constructor(store, requests) {
        this.store = store;
        this.requests = requests;
    }
    analyze(requestId, dto) {
        const request = this.requests.get(requestId);
        const nodes = this.store.listDependencyNodes();
        const edges = this.store.listDependencyEdges();
        const relevantNodes = nodes.filter((node) => node.environment ===
            request.environment &&
            node.namespace ===
                request.namespace &&
            (!request.service ||
                node.service ===
                    request.service ||
                node.key ===
                    request.service));
        const directNodeIds = new Set(relevantNodes.map((node) => node.id));
        const indirectNodeIds = new Set();
        for (const edge of edges) {
            if (directNodeIds.has(edge.sourceNodeId)) {
                indirectNodeIds.add(edge.targetNodeId);
            }
            if (directNodeIds.has(edge.targetNodeId)) {
                indirectNodeIds.add(edge.sourceNodeId);
            }
        }
        for (const id of directNodeIds) {
            indirectNodeIds.delete(id);
        }
        const items = [];
        for (const node of relevantNodes) {
            const score = (0, utils_1.clampGovernanceScore)(node.criticality * 0.6 +
                (100 - node.healthScore) * 0.4);
            items.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.DEPENDENCY,
                resourceId: node.id,
                resourceName: node.name,
                direct: true,
                impactScore: score,
                riskLevel: (0, utils_1.governanceRiskFromScore)(score),
                reason: "Direct dependency impact detected",
                metadata: {
                    healthStatus: node.healthStatus,
                    criticality: node.criticality,
                },
            });
        }
        for (const nodeId of indirectNodeIds) {
            const node = this.store
                .getDependencyNode(nodeId);
            if (!node) {
                continue;
            }
            const score = (0, utils_1.clampGovernanceScore)(node.criticality * 0.35 +
                (100 - node.healthScore) * 0.25);
            items.push({
                id: (0, crypto_1.randomUUID)(),
                category: contracts_1.GovernanceImpactCategory.DEPENDENCY,
                resourceId: node.id,
                resourceName: node.name,
                direct: false,
                impactScore: score,
                riskLevel: (0, utils_1.governanceRiskFromScore)(score),
                reason: "Indirect dependency propagation detected",
                metadata: {
                    healthStatus: node.healthStatus,
                    criticality: node.criticality,
                },
            });
        }
        const context = (dto.context ?? {});
        const businessImpact = (0, utils_1.clampGovernanceScore)(request.businessCriticality ??
            Number(context.businessCriticality ??
                40));
        items.push({
            id: (0, crypto_1.randomUUID)(),
            category: contracts_1.GovernanceImpactCategory.BUSINESS,
            resourceId: request.id,
            resourceName: request.title,
            direct: true,
            impactScore: businessImpact,
            riskLevel: (0, utils_1.governanceRiskFromScore)(businessImpact),
            reason: "Business criticality impact",
            metadata: {},
        });
        const overallImpactScore = items.length === 0
            ? 0
            : (0, utils_1.clampGovernanceScore)(items.reduce((total, item) => total +
                item.impactScore, 0) /
                items.length);
        const affectedServices = Array.from(new Set(items
            .map((item) => this.store
            .getDependencyNode(item.resourceId)?.service)
            .filter((service) => Boolean(service))));
        const analysis = {
            id: (0, crypto_1.randomUUID)(),
            requestId: request.id,
            overallImpactScore,
            overallRiskLevel: (0, utils_1.governanceRiskFromScore)(overallImpactScore),
            directlyAffectedResources: items.filter((item) => item.direct).length,
            indirectlyAffectedResources: items.filter((item) => !item.direct).length,
            affectedServices,
            affectedDependencies: items
                .filter((item) => item.category ===
                contracts_1.GovernanceImpactCategory.DEPENDENCY)
                .map((item) => item.resourceId),
            items,
            recommendations: this.buildRecommendations(overallImpactScore, items),
            analyzedAt: new Date().toISOString(),
        };
        return this.store
            .saveImpactAnalysis(analysis);
    }
    list() {
        return this.store
            .listImpactAnalyses();
    }
    get(id) {
        const item = this.store
            .getImpactAnalysis(id);
        if (!item) {
            throw new common_1.NotFoundException(`Governance impact analysis ${id} was not found`);
        }
        return item;
    }
    buildRecommendations(score, items) {
        const recommendations = [];
        if (score >= 65) {
            recommendations.push("Require elevated approval and phased execution");
            recommendations.push("Create a dedicated runtime monitoring plan");
        }
        if (items.some((item) => !item.direct &&
            item.impactScore >= 40)) {
            recommendations.push("Review indirect dependency propagation before execution");
        }
        if (items.length >= 5) {
            recommendations.push("Reduce the deployment scope to limit blast radius");
        }
        if (recommendations.length === 0) {
            recommendations.push("Proceed with standard impact monitoring");
        }
        return recommendations;
    }
};
exports.RuntimeGovernanceImpactService = RuntimeGovernanceImpactService;
exports.RuntimeGovernanceImpactService = RuntimeGovernanceImpactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_request_service_1.RuntimeGovernanceRequestService])
], RuntimeGovernanceImpactService);
//# sourceMappingURL=runtime-governance-impact.service.js.map