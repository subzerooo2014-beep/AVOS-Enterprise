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
exports.RuntimeDependencyGraphService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_audit_service_1 = require("./runtime-governance-audit.service");
let RuntimeDependencyGraphService = class RuntimeDependencyGraphService {
    constructor(store, audit) {
        this.store = store;
        this.audit = audit;
    }
    createNode(dto) {
        const duplicate = this.store
            .listDependencyNodes()
            .find((node) => node.key === dto.key &&
            node.environment ===
                dto.environment &&
            node.namespace ===
                dto.namespace);
        if (duplicate) {
            throw new common_1.BadRequestException(`Dependency node already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const node = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            type: dto.type,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            criticality: dto.criticality,
            healthStatus: dto.healthStatus ??
                contracts_1.DependencyHealthStatus.UNKNOWN,
            healthScore: dto.healthScore ?? 0,
            region: dto.region,
            zone: dto.zone,
            owner: dto.owner,
            tags: dto.tags ?? [],
            metadata: (dto.metadata ?? {}),
            createdAt: now,
            updatedAt: now,
            lastHealthCheckAt: dto.healthStatus
                ? now
                : undefined,
        };
        const saved = this.store.saveDependencyNode(node);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .DEPENDENCY_REGISTERED,
            aggregateType: "runtime_dependency_node",
            aggregateId: saved.id,
            actor: {
                id: "avos-dependency-graph",
                type: "system",
                name: "AVOS Dependency Graph",
                roles: [
                    "runtime_governance",
                ],
            },
            payload: {
                nodeId: saved.id,
                key: saved.key,
                name: saved.name,
                type: saved.type,
                environment: saved.environment,
                namespace: saved.namespace,
                criticality: saved.criticality,
                healthStatus: saved.healthStatus,
                healthScore: saved.healthScore,
            },
        });
        return saved;
    }
    createEdge(dto) {
        const source = this.getNode(dto.sourceNodeId);
        const target = this.getNode(dto.targetNodeId);
        if (source.id === target.id) {
            throw new common_1.BadRequestException("A dependency node cannot depend on itself");
        }
        if (source.environment !==
            target.environment ||
            source.namespace !==
                target.namespace) {
            throw new common_1.BadRequestException("Dependency edge nodes must belong to the same environment and namespace");
        }
        if (dto.fallbackNodeId) {
            const fallback = this.getNode(dto.fallbackNodeId);
            if (fallback.id ===
                source.id ||
                fallback.id ===
                    target.id) {
                throw new common_1.BadRequestException("Fallback node must be different from source and target");
            }
        }
        const duplicate = this.store
            .listDependencyEdges()
            .find((edge) => edge.sourceNodeId ===
            dto.sourceNodeId &&
            edge.targetNodeId ===
                dto.targetNodeId &&
            edge.relationshipType ===
                dto.relationshipType);
        if (duplicate) {
            throw new common_1.BadRequestException("Dependency edge already exists");
        }
        if (this.wouldCreateCycle(dto.sourceNodeId, dto.targetNodeId)) {
            throw new common_1.BadRequestException("Dependency edge would create a cycle");
        }
        const now = new Date().toISOString();
        const edge = {
            id: (0, crypto_1.randomUUID)(),
            sourceNodeId: dto.sourceNodeId,
            targetNodeId: dto.targetNodeId,
            relationshipType: dto.relationshipType,
            criticality: dto.criticality,
            timeoutMilliseconds: dto.timeoutMilliseconds,
            retryEnabled: dto.retryEnabled,
            fallbackNodeId: dto.fallbackNodeId,
            metadata: (dto.metadata ?? {}),
            createdAt: now,
            updatedAt: now,
        };
        const saved = this.store.saveDependencyEdge(edge);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .DEPENDENCY_REGISTERED,
            aggregateType: "runtime_dependency_edge",
            aggregateId: saved.id,
            actor: {
                id: "avos-dependency-graph",
                type: "system",
                name: "AVOS Dependency Graph",
                roles: [
                    "runtime_governance",
                ],
            },
            payload: {
                edgeId: saved.id,
                sourceNodeId: saved.sourceNodeId,
                targetNodeId: saved.targetNodeId,
                relationshipType: saved.relationshipType,
                criticality: saved.criticality,
                retryEnabled: saved.retryEnabled,
                fallbackNodeId: saved.fallbackNodeId ?? null,
            },
        });
        return saved;
    }
    updateHealth(id, dto) {
        const node = this.getNode(id);
        node.healthStatus =
            dto.healthStatus;
        node.healthScore =
            dto.healthScore;
        node.metadata = {
            ...node.metadata,
            ...(dto.metadata ?? {}),
        };
        node.lastHealthCheckAt =
            new Date().toISOString();
        node.updatedAt =
            node.lastHealthCheckAt;
        const saved = this.store
            .saveDependencyNode(node);
        this.audit.append({
            type: contracts_1.GovernanceAuditEventType
                .DEPENDENCY_HEALTH_UPDATED,
            aggregateType: "runtime_dependency_node",
            aggregateId: saved.id,
            actor: {
                id: "avos-dependency-health",
                type: "system",
                name: "AVOS Dependency Health",
                roles: [
                    "runtime_governance",
                ],
            },
            payload: {
                nodeId: saved.id,
                healthStatus: saved.healthStatus,
                healthScore: saved.healthScore,
                lastHealthCheckAt: saved.lastHealthCheckAt ?? null,
            },
        });
        return saved;
    }
    listNodes() {
        return this.store
            .listDependencyNodes();
    }
    listEdges() {
        return this.store
            .listDependencyEdges();
    }
    getNode(id) {
        const node = this.store
            .getDependencyNode(id);
        if (!node) {
            throw new common_1.NotFoundException(`Dependency node ${id} was not found`);
        }
        return node;
    }
    getEdge(id) {
        const edge = this.store
            .getDependencyEdge(id);
        if (!edge) {
            throw new common_1.NotFoundException(`Dependency edge ${id} was not found`);
        }
        return edge;
    }
    getOutgoingEdges(nodeId) {
        this.getNode(nodeId);
        return this.store
            .listDependencyEdges()
            .filter((edge) => edge.sourceNodeId ===
            nodeId);
    }
    getIncomingEdges(nodeId) {
        this.getNode(nodeId);
        return this.store
            .listDependencyEdges()
            .filter((edge) => edge.targetNodeId ===
            nodeId);
    }
    getGraphSnapshot(environment, namespace) {
        const nodes = this.listNodes().filter((node) => (!environment ||
            node.environment ===
                environment) &&
            (!namespace ||
                node.namespace ===
                    namespace));
        const nodeIds = new Set(nodes.map((node) => node.id));
        const edges = this.listEdges().filter((edge) => nodeIds.has(edge.sourceNodeId) &&
            nodeIds.has(edge.targetNodeId));
        return {
            nodes,
            edges,
            healthyNodes: nodes.filter((node) => node.healthStatus ===
                contracts_1.DependencyHealthStatus.HEALTHY).length,
            degradedNodes: nodes.filter((node) => node.healthStatus ===
                contracts_1.DependencyHealthStatus.DEGRADED).length,
            unhealthyNodes: nodes.filter((node) => node.healthStatus ===
                contracts_1.DependencyHealthStatus.UNHEALTHY).length,
            unavailableNodes: nodes.filter((node) => node.healthStatus ===
                contracts_1.DependencyHealthStatus.UNAVAILABLE).length,
            unknownNodes: nodes.filter((node) => node.healthStatus ===
                contracts_1.DependencyHealthStatus.UNKNOWN).length,
            generatedAt: new Date().toISOString(),
        };
    }
    wouldCreateCycle(sourceNodeId, targetNodeId) {
        const edges = this.store
            .listDependencyEdges();
        const adjacency = new Map();
        for (const edge of edges) {
            const targets = adjacency.get(edge.sourceNodeId) ?? [];
            targets.push(edge.targetNodeId);
            adjacency.set(edge.sourceNodeId, targets);
        }
        const addedTargets = adjacency.get(sourceNodeId) ?? [];
        addedTargets.push(targetNodeId);
        adjacency.set(sourceNodeId, addedTargets);
        const visited = new Set();
        const active = new Set();
        const visit = (nodeId) => {
            if (active.has(nodeId)) {
                return true;
            }
            if (visited.has(nodeId)) {
                return false;
            }
            visited.add(nodeId);
            active.add(nodeId);
            for (const child of adjacency.get(nodeId) ?? []) {
                if (visit(child)) {
                    return true;
                }
            }
            active.delete(nodeId);
            return false;
        };
        for (const nodeId of adjacency.keys()) {
            if (visit(nodeId)) {
                return true;
            }
        }
        return false;
    }
};
exports.RuntimeDependencyGraphService = RuntimeDependencyGraphService;
exports.RuntimeDependencyGraphService = RuntimeDependencyGraphService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_audit_service_1.RuntimeGovernanceAuditService])
], RuntimeDependencyGraphService);
//# sourceMappingURL=runtime-dependency-graph.service.js.map