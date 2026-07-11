import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  DependencyHealthStatus,
  GovernanceAuditEventType,
  GovernanceJsonValue,
  RuntimeDependencyEdge,
  RuntimeDependencyNode,
} from "../contracts";
import {
  CreateDependencyEdgeDto,
  CreateDependencyNodeDto,
  UpdateDependencyHealthDto,
} from "../dto";
import {
  RuntimeGovernanceStore,
} from "../stores/runtime-governance.store";
import {
  RuntimeGovernanceAuditService,
} from "./runtime-governance-audit.service";

@Injectable()
export class RuntimeDependencyGraphService {
  constructor(
    private readonly store:
      RuntimeGovernanceStore,
    private readonly audit:
      RuntimeGovernanceAuditService,
  ) {}

  createNode(
    dto: CreateDependencyNodeDto,
  ): RuntimeDependencyNode {
    const duplicate =
      this.store
        .listDependencyNodes()
        .find(
          (node) =>
            node.key === dto.key &&
            node.environment ===
              dto.environment &&
            node.namespace ===
              dto.namespace,
        );

    if (duplicate) {
      throw new BadRequestException(
        `Dependency node already exists for key ${dto.key}`,
      );
    }

    const now =
      new Date().toISOString();

    const node:
      RuntimeDependencyNode = {
      id:
        randomUUID(),
      key:
        dto.key,
      name:
        dto.name,
      type:
        dto.type,
      environment:
        dto.environment,
      namespace:
        dto.namespace,
      service:
        dto.service,
      criticality:
        dto.criticality,
      healthStatus:
        dto.healthStatus ??
        DependencyHealthStatus.UNKNOWN,
      healthScore:
        dto.healthScore ?? 0,
      region:
        dto.region,
      zone:
        dto.zone,
      owner:
        dto.owner,
      tags:
        dto.tags ?? [],
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdAt:
        now,
      updatedAt:
        now,
      lastHealthCheckAt:
        dto.healthStatus
          ? now
          : undefined,
    };

    const saved =
      this.store.saveDependencyNode(node);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .DEPENDENCY_REGISTERED,
      aggregateType:
        "runtime_dependency_node",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-dependency-graph",
        type:
          "system",
        name:
          "AVOS Dependency Graph",
        roles: [
          "runtime_governance",
        ],
      },
      payload: {
        nodeId:
          saved.id,
        key:
          saved.key,
        name:
          saved.name,
        type:
          saved.type,
        environment:
          saved.environment,
        namespace:
          saved.namespace,
        criticality:
          saved.criticality,
        healthStatus:
          saved.healthStatus,
        healthScore:
          saved.healthScore,
      },
    });

    return saved;
  }

  createEdge(
    dto: CreateDependencyEdgeDto,
  ): RuntimeDependencyEdge {
    const source =
      this.getNode(
        dto.sourceNodeId,
      );

    const target =
      this.getNode(
        dto.targetNodeId,
      );

    if (
      source.id === target.id
    ) {
      throw new BadRequestException(
        "A dependency node cannot depend on itself",
      );
    }

    if (
      source.environment !==
        target.environment ||
      source.namespace !==
        target.namespace
    ) {
      throw new BadRequestException(
        "Dependency edge nodes must belong to the same environment and namespace",
      );
    }

    if (
      dto.fallbackNodeId
    ) {
      const fallback =
        this.getNode(
          dto.fallbackNodeId,
        );

      if (
        fallback.id ===
          source.id ||
        fallback.id ===
          target.id
      ) {
        throw new BadRequestException(
          "Fallback node must be different from source and target",
        );
      }
    }

    const duplicate =
      this.store
        .listDependencyEdges()
        .find(
          (edge) =>
            edge.sourceNodeId ===
              dto.sourceNodeId &&
            edge.targetNodeId ===
              dto.targetNodeId &&
            edge.relationshipType ===
              dto.relationshipType,
        );

    if (duplicate) {
      throw new BadRequestException(
        "Dependency edge already exists",
      );
    }

    if (
      this.wouldCreateCycle(
        dto.sourceNodeId,
        dto.targetNodeId,
      )
    ) {
      throw new BadRequestException(
        "Dependency edge would create a cycle",
      );
    }

    const now =
      new Date().toISOString();

    const edge:
      RuntimeDependencyEdge = {
      id:
        randomUUID(),
      sourceNodeId:
        dto.sourceNodeId,
      targetNodeId:
        dto.targetNodeId,
      relationshipType:
        dto.relationshipType,
      criticality:
        dto.criticality,
      timeoutMilliseconds:
        dto.timeoutMilliseconds,
      retryEnabled:
        dto.retryEnabled,
      fallbackNodeId:
        dto.fallbackNodeId,
      metadata:
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >,
      createdAt:
        now,
      updatedAt:
        now,
    };

    const saved =
      this.store.saveDependencyEdge(edge);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .DEPENDENCY_REGISTERED,
      aggregateType:
        "runtime_dependency_edge",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-dependency-graph",
        type:
          "system",
        name:
          "AVOS Dependency Graph",
        roles: [
          "runtime_governance",
        ],
      },
      payload: {
        edgeId:
          saved.id,
        sourceNodeId:
          saved.sourceNodeId,
        targetNodeId:
          saved.targetNodeId,
        relationshipType:
          saved.relationshipType,
        criticality:
          saved.criticality,
        retryEnabled:
          saved.retryEnabled,
        fallbackNodeId:
          saved.fallbackNodeId ?? null,
      },
    });

    return saved;
  }

  updateHealth(
    id: string,
    dto: UpdateDependencyHealthDto,
  ): RuntimeDependencyNode {
    const node =
      this.getNode(id);

    node.healthStatus =
      dto.healthStatus;

    node.healthScore =
      dto.healthScore;

    node.metadata = {
      ...node.metadata,
      ...(
        (dto.metadata ?? {}) as Record<
          string,
          GovernanceJsonValue
        >
      ),
    };

    node.lastHealthCheckAt =
      new Date().toISOString();

    node.updatedAt =
      node.lastHealthCheckAt;

    const saved =
      this.store
        .saveDependencyNode(node);

    this.audit.append({
      type:
        GovernanceAuditEventType
          .DEPENDENCY_HEALTH_UPDATED,
      aggregateType:
        "runtime_dependency_node",
      aggregateId:
        saved.id,
      actor: {
        id:
          "avos-dependency-health",
        type:
          "system",
        name:
          "AVOS Dependency Health",
        roles: [
          "runtime_governance",
        ],
      },
      payload: {
        nodeId:
          saved.id,
        healthStatus:
          saved.healthStatus,
        healthScore:
          saved.healthScore,
        lastHealthCheckAt:
          saved.lastHealthCheckAt ?? null,
      },
    });

    return saved;
  }

  listNodes():
    RuntimeDependencyNode[] {
    return this.store
      .listDependencyNodes();
  }

  listEdges():
    RuntimeDependencyEdge[] {
    return this.store
      .listDependencyEdges();
  }

  getNode(
    id: string,
  ): RuntimeDependencyNode {
    const node =
      this.store
        .getDependencyNode(id);

    if (!node) {
      throw new NotFoundException(
        `Dependency node ${id} was not found`,
      );
    }

    return node;
  }

  getEdge(
    id: string,
  ): RuntimeDependencyEdge {
    const edge =
      this.store
        .getDependencyEdge(id);

    if (!edge) {
      throw new NotFoundException(
        `Dependency edge ${id} was not found`,
      );
    }

    return edge;
  }

  getOutgoingEdges(
    nodeId: string,
  ): RuntimeDependencyEdge[] {
    this.getNode(nodeId);

    return this.store
      .listDependencyEdges()
      .filter(
        (edge) =>
          edge.sourceNodeId ===
          nodeId,
      );
  }

  getIncomingEdges(
    nodeId: string,
  ): RuntimeDependencyEdge[] {
    this.getNode(nodeId);

    return this.store
      .listDependencyEdges()
      .filter(
        (edge) =>
          edge.targetNodeId ===
          nodeId,
      );
  }

  getGraphSnapshot(
    environment?: string,
    namespace?: string,
  ): {
    nodes:
      RuntimeDependencyNode[];
    edges:
      RuntimeDependencyEdge[];
    healthyNodes: number;
    degradedNodes: number;
    unhealthyNodes: number;
    unavailableNodes: number;
    unknownNodes: number;
    generatedAt: string;
  } {
    const nodes =
      this.listNodes().filter(
        (node) =>
          (
            !environment ||
            node.environment ===
              environment
          ) &&
          (
            !namespace ||
            node.namespace ===
              namespace
          ),
      );

    const nodeIds =
      new Set(
        nodes.map(
          (node) => node.id,
        ),
      );

    const edges =
      this.listEdges().filter(
        (edge) =>
          nodeIds.has(
            edge.sourceNodeId,
          ) &&
          nodeIds.has(
            edge.targetNodeId,
          ),
      );

    return {
      nodes,
      edges,
      healthyNodes:
        nodes.filter(
          (node) =>
            node.healthStatus ===
            DependencyHealthStatus.HEALTHY,
        ).length,
      degradedNodes:
        nodes.filter(
          (node) =>
            node.healthStatus ===
            DependencyHealthStatus.DEGRADED,
        ).length,
      unhealthyNodes:
        nodes.filter(
          (node) =>
            node.healthStatus ===
            DependencyHealthStatus.UNHEALTHY,
        ).length,
      unavailableNodes:
        nodes.filter(
          (node) =>
            node.healthStatus ===
            DependencyHealthStatus.UNAVAILABLE,
        ).length,
      unknownNodes:
        nodes.filter(
          (node) =>
            node.healthStatus ===
            DependencyHealthStatus.UNKNOWN,
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private wouldCreateCycle(
    sourceNodeId: string,
    targetNodeId: string,
  ): boolean {
    const edges =
      this.store
        .listDependencyEdges();

    const adjacency =
      new Map<
        string,
        string[]
      >();

    for (const edge of edges) {
      const targets =
        adjacency.get(
          edge.sourceNodeId,
        ) ?? [];

      targets.push(
        edge.targetNodeId,
      );

      adjacency.set(
        edge.sourceNodeId,
        targets,
      );
    }

    const addedTargets =
      adjacency.get(
        sourceNodeId,
      ) ?? [];

    addedTargets.push(
      targetNodeId,
    );

    adjacency.set(
      sourceNodeId,
      addedTargets,
    );

    const visited =
      new Set<string>();

    const active =
      new Set<string>();

    const visit = (
      nodeId: string,
    ): boolean => {
      if (
        active.has(nodeId)
      ) {
        return true;
      }

      if (
        visited.has(nodeId)
      ) {
        return false;
      }

      visited.add(nodeId);
      active.add(nodeId);

      for (
        const child of
        adjacency.get(nodeId) ?? []
      ) {
        if (visit(child)) {
          return true;
        }
      }

      active.delete(nodeId);

      return false;
    };

    for (
      const nodeId of
      adjacency.keys()
    ) {
      if (visit(nodeId)) {
        return true;
      }
    }

    return false;
  }
}
