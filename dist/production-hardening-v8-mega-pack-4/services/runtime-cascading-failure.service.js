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
exports.RuntimeCascadingFailureService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
const runtime_dependency_graph_service_1 = require("./runtime-dependency-graph.service");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeCascadingFailureService = class RuntimeCascadingFailureService {
    constructor(store, graph, audit) {
        this.store = store;
        this.graph = graph;
        this.audit = audit;
    }
    analyze(sourceNodeId) {
        const source = this.graph.getNode(sourceNodeId);
        const paths = this.discoverPaths(sourceNodeId);
        const affectedNodeIds = new Set();
        const affectedServices = new Set();
        let cumulativeRisk = 0;
        for (const path of paths) {
            for (const nodeId of path.nodeIds) {
                if (nodeId !==
                    sourceNodeId) {
                    affectedNodeIds.add(nodeId);
                }
                const node = this.store
                    .getDependencyNode(nodeId);
                if (node?.service) {
                    affectedServices.add(node.service);
                }
            }
            cumulativeRisk +=
                path.cumulativeCriticality;
        }
        const directDependents = this.graph
            .getIncomingEdges(sourceNodeId).length;
        const healthPenalty = this.healthPenalty(source.healthStatus);
        const pathPenalty = Math.min(40, paths.length * 5);
        const dependentPenalty = Math.min(20, affectedNodeIds.size * 3);
        const criticalityPenalty = Math.round(source.criticality * 0.3);
        const cumulativePenalty = Math.min(25, Math.round(cumulativeRisk /
            Math.max(1, paths.length) *
            0.15));
        const riskScore = (0, utils_1.clampGovernanceScore)(healthPenalty +
            pathPenalty +
            dependentPenalty +
            criticalityPenalty +
            cumulativePenalty);
        const risk = (0, utils_1.cascadeRiskFromScore)(riskScore);
        const recommendations = this.buildRecommendations(risk, affectedNodeIds.size, affectedServices.size, source.healthStatus);
        const analysis = {
            id: (0, crypto_1.randomUUID)(),
            sourceNodeId: source.id,
            risk,
            riskScore,
            directDependents,
            totalAffectedNodes: affectedNodeIds.size,
            affectedServiceCount: affectedServices.size,
            paths,
            recommendations,
            analyzedAt: new Date().toISOString(),
        };
        const saved = this.store
            .saveCascadeAnalysis(analysis);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .CASCADE_ANALYZED,
            aggregateType: "cascading_failure_analysis",
            aggregateId: saved.id,
            actor: {
                id: "avos-cascade-analyzer",
                type: "system",
                name: "AVOS Cascade Analyzer",
                roles: [
                    "runtime_governance",
                    "resilience_analysis",
                ],
            },
            payload: {
                analysisId: saved.id,
                sourceNodeId: saved.sourceNodeId,
                risk: saved.risk,
                riskScore: saved.riskScore,
                directDependents: saved.directDependents,
                totalAffectedNodes: saved.totalAffectedNodes,
                affectedServiceCount: saved.affectedServiceCount,
                paths: saved.paths.length,
            },
        });
        return saved;
    }
    list() {
        return this.store
            .listCascadeAnalyses();
    }
    discoverPaths(sourceNodeId) {
        const edges = this.store
            .listDependencyEdges();
        const reverseAdjacency = new Map();
        for (const edge of edges) {
            const incoming = reverseAdjacency.get(edge.targetNodeId) ?? [];
            incoming.push(edge);
            reverseAdjacency.set(edge.targetNodeId, incoming);
        }
        const paths = [];
        const walk = (currentNodeId, nodeIds, edgeIds, cumulativeCriticality, visited) => {
            const dependents = reverseAdjacency.get(currentNodeId) ?? [];
            for (const edge of dependents) {
                if (visited.has(edge.sourceNodeId)) {
                    continue;
                }
                if (edge.relationshipType ===
                    contracts_1.DependencyRelationshipType.OPTIONAL ||
                    edge.relationshipType ===
                        contracts_1.DependencyRelationshipType.FALLBACK) {
                    continue;
                }
                const dependent = this.store
                    .getDependencyNode(edge.sourceNodeId);
                if (!dependent) {
                    continue;
                }
                const nextNodeIds = [
                    ...nodeIds,
                    dependent.id,
                ];
                const nextEdgeIds = [
                    ...edgeIds,
                    edge.id,
                ];
                const nextCriticality = cumulativeCriticality +
                    edge.criticality +
                    dependent.criticality;
                const affectedServices = nextNodeIds
                    .map((nodeId) => this.store
                    .getDependencyNode(nodeId)?.service)
                    .filter((service) => Boolean(service));
                paths.push({
                    nodeIds: nextNodeIds,
                    edgeIds: nextEdgeIds,
                    cumulativeCriticality: nextCriticality,
                    affectedServices: Array.from(new Set(affectedServices)),
                    risk: (0, utils_1.cascadeRiskFromScore)(Math.min(100, Math.round(nextCriticality /
                        nextNodeIds.length))),
                });
                const nextVisited = new Set(visited);
                nextVisited.add(dependent.id);
                walk(dependent.id, nextNodeIds, nextEdgeIds, nextCriticality, nextVisited);
            }
        };
        walk(sourceNodeId, [sourceNodeId], [], 0, new Set([
            sourceNodeId,
        ]));
        return paths;
    }
    healthPenalty(status) {
        switch (status) {
            case contracts_1.DependencyHealthStatus.UNAVAILABLE:
                return 45;
            case contracts_1.DependencyHealthStatus.UNHEALTHY:
                return 35;
            case contracts_1.DependencyHealthStatus.DEGRADED:
                return 20;
            case contracts_1.DependencyHealthStatus.UNKNOWN:
                return 10;
            case contracts_1.DependencyHealthStatus.HEALTHY:
            default:
                return 0;
        }
    }
    buildRecommendations(risk, affectedNodes, affectedServices, healthStatus) {
        const recommendations = [];
        if (healthStatus ===
            contracts_1.DependencyHealthStatus.UNHEALTHY ||
            healthStatus ===
                contracts_1.DependencyHealthStatus.UNAVAILABLE) {
            recommendations.push("Initiate immediate dependency isolation assessment");
        }
        if (affectedNodes >= 3) {
            recommendations.push("Reduce dependency blast radius through segmentation");
        }
        if (affectedServices >= 2) {
            recommendations.push("Activate cross-service incident coordination");
        }
        if (risk ===
            contracts_1.CascadingFailureRisk.HIGH ||
            risk ===
                contracts_1.CascadingFailureRisk.CRITICAL) {
            recommendations.push("Require manual governance approval before dependent deployments");
            recommendations.push("Validate fallback and rollback paths");
            recommendations.push("Increase monitoring frequency for all affected nodes");
        }
        if (recommendations.length === 0) {
            recommendations.push("Continue standard dependency monitoring");
        }
        return recommendations;
    }
};
exports.RuntimeCascadingFailureService = RuntimeCascadingFailureService;
exports.RuntimeCascadingFailureService = RuntimeCascadingFailureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_dependency_graph_service_1.RuntimeDependencyGraphService,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeCascadingFailureService);
//# sourceMappingURL=runtime-cascading-failure.service.js.map