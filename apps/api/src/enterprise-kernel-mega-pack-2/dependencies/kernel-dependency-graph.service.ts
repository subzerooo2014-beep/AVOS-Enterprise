import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KernelDependencyEdge,
  KernelDependencyNode,
  KernelDependencyType
} from "../enterprise-kernel-mega-pack-2.types";
import { KernelDependencyConfigurationAuditService } from "../observability/kernel-dependency-configuration-audit.service";

@Injectable()
export class KernelDependencyGraphService {
  private readonly nodes =
    new Map<string, KernelDependencyNode>();

  private readonly edges =
    new Map<string, KernelDependencyEdge>();

  constructor(
    private readonly audit: KernelDependencyConfigurationAuditService
  ) {
    this.seed();
  }

  listNodes() {
    return Array.from(this.nodes.values());
  }

  listEdges() {
    return Array.from(this.edges.values());
  }

  getNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(
        `Kernel dependency node not found: ${id}`
      );
    }

    return node;
  }

  registerNode(
    input: Omit<KernelDependencyNode, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.nodes.has(input.id)) {
      throw new ConflictException(
        `Kernel dependency node already exists: ${input.id}`
      );
    }

    if (!/^\d+\.\d+\.\d+$/.test(input.version)) {
      throw new ConflictException(
        `Kernel dependency node version is invalid: ${input.version}`
      );
    }

    const now = new Date().toISOString();

    const node: KernelDependencyNode = {
      ...input,
      capabilities: Array.from(
        new Set(input.capabilities)
      ),
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: context.correlationId,
      category: "dependency",
      action: "kernel-dependency-node-registered",
      subjectId: node.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        version: node.version,
        providerModule: node.providerModule
      }
    });

    return node;
  }

  updateNode(
    id: string,
    patch: {
      version?: string;
      active?: boolean;
      capabilities?: string[];
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.getNode(id);

    if (
      patch.version &&
      !/^\d+\.\d+\.\d+$/.test(patch.version)
    ) {
      throw new ConflictException(
        `Kernel dependency node version is invalid: ${patch.version}`
      );
    }

    const updated: KernelDependencyNode = {
      ...current,
      ...patch,
      capabilities:
        patch.capabilities === undefined
          ? current.capabilities
          : Array.from(new Set(patch.capabilities)),
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.nodes.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "dependency",
      action: "kernel-dependency-node-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: updated.active
        ? "success"
        : "warning",
      metadata: {
        version: updated.version,
        active: updated.active
      }
    });

    return updated;
  }

  registerEdge(input: {
    fromNodeId: string;
    toNodeId: string;
    dependencyType: KernelDependencyType;
    requiredVersion?: string;
    reason: string;
    active?: boolean;
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    if (input.fromNodeId === input.toNodeId) {
      throw new ConflictException(
        "Kernel dependency cannot reference itself."
      );
    }

    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    const duplicate = this.listEdges().find(
      (edge) =>
        edge.fromNodeId === input.fromNodeId &&
        edge.toNodeId === input.toNodeId &&
        edge.dependencyType === input.dependencyType
    );

    if (duplicate) {
      return duplicate;
    }

    const edge: KernelDependencyEdge = {
      id: `kernel-dependency-edge:${Date.now()}:${
        this.edges.size + 1
      }`,
      fromNodeId: input.fromNodeId,
      toNodeId: input.toNodeId,
      dependencyType: input.dependencyType,
      requiredVersion: input.requiredVersion,
      reason: input.reason,
      active: input.active ?? true,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.edges.set(edge.id, edge);

    this.audit.record({
      correlationId: input.correlationId,
      category: "dependency",
      action: "kernel-dependency-edge-registered",
      subjectId: edge.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        fromNodeId: edge.fromNodeId,
        toNodeId: edge.toNodeId,
        dependencyType: edge.dependencyType
      }
    });

    return edge;
  }

  outgoing(nodeId: string) {
    this.getNode(nodeId);

    return this.listEdges().filter(
      (edge) =>
        edge.fromNodeId === nodeId &&
        edge.active
    );
  }

  incoming(nodeId: string) {
    this.getNode(nodeId);

    return this.listEdges().filter(
      (edge) =>
        edge.toNodeId === nodeId &&
        edge.active
    );
  }

  removeEdge(id: string) {
    const edge = this.edges.get(id);

    if (!edge) {
      throw new NotFoundException(
        `Kernel dependency edge not found: ${id}`
      );
    }

    this.edges.delete(id);
    return edge;
  }

  summary() {
    const nodes = this.listNodes();
    const edges = this.listEdges();

    return {
      nodes: nodes.length,
      activeNodes: nodes.filter(
        (node) => node.active
      ).length,
      edges: edges.length,
      activeEdges: edges.filter(
        (edge) => edge.active
      ).length,
      requiredEdges: edges.filter(
        (edge) =>
          edge.dependencyType === "required"
      ).length,
      optionalEdges: edges.filter(
        (edge) =>
          edge.dependencyType === "optional"
      ).length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const nodes: KernelDependencyNode[] = [
      {
        id: "kernel-node:runtime",
        name: "Kernel Runtime",
        version: "1.0.0",
        providerModule:
          "EnterpriseKernelMegaPack1Module",
        capabilities: [
          "kernel.runtime",
          "kernel.state",
          "kernel.context"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-node:lifecycle",
        name: "Kernel Lifecycle",
        version: "1.0.0",
        providerModule:
          "EnterpriseKernelMegaPack1Module",
        capabilities: [
          "kernel.module-registry",
          "kernel.lifecycle"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      },
      {
        id: "kernel-node:dependency-config",
        name:
          "Kernel Dependency and Configuration",
        version: "1.0.0",
        providerModule:
          "EnterpriseKernelMegaPack2Module",
        capabilities: [
          "kernel.dependencies",
          "kernel.compatibility",
          "kernel.configuration"
        ],
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const node of nodes) {
      this.nodes.set(node.id, node);
    }

    const edges: KernelDependencyEdge[] = [
      {
        id: "kernel-edge:lifecycle-runtime",
        fromNodeId: "kernel-node:lifecycle",
        toNodeId: "kernel-node:runtime",
        dependencyType: "required",
        requiredVersion: ">=1.0.0",
        reason:
          "Lifecycle execution requires the kernel runtime.",
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now
      },
      {
        id: "kernel-edge:dependency-runtime",
        fromNodeId:
          "kernel-node:dependency-config",
        toNodeId: "kernel-node:runtime",
        dependencyType: "required",
        requiredVersion: ">=1.0.0",
        reason:
          "Dependency and configuration services require runtime context.",
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now
      },
      {
        id: "kernel-edge:dependency-lifecycle",
        fromNodeId:
          "kernel-node:dependency-config",
        toNodeId: "kernel-node:lifecycle",
        dependencyType: "required",
        requiredVersion: ">=1.0.0",
        reason:
          "Dependency resolution controls lifecycle activation order.",
        active: true,
        metadata: {
          seeded: true
        },
        createdAt: now
      }
    ];

    for (const edge of edges) {
      this.edges.set(edge.id, edge);
    }
  }
}
