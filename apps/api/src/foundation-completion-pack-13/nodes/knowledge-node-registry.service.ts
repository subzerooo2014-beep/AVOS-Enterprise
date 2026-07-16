import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KnowledgeNode,
  KnowledgeNodeStatus,
  KnowledgeNodeType
} from "../foundation-pack-13.types";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeNodeRegistryService {
  private readonly nodes = new Map<string, KnowledgeNode>();

  constructor(
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.nodes.values());
  }

  get(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(
        `Knowledge node not found: ${id}`
      );
    }

    return node;
  }

  register(input: {
    id?: string;
    type: KnowledgeNodeType;
    canonicalName: string;
    displayName: string;
    description: string;
    identityId?: string;
    sourceSystem: string;
    domain: string;
    tags?: string[];
    attributes?: Record<string, unknown>;
    confidence?: number;
    correlationId: string;
    actorIdentityId: string;
  }) {
    const now = new Date().toISOString();

    const node: KnowledgeNode = {
      id:
        input.id ??
        `knowledge-node:${input.type}:${this.slug(input.canonicalName)}`,
      type: input.type,
      canonicalName: input.canonicalName.trim(),
      displayName: input.displayName.trim(),
      description: input.description.trim(),
      status: "active",
      identityId: input.identityId,
      sourceSystem: input.sourceSystem,
      domain: input.domain,
      tags: Array.from(new Set(input.tags ?? [])),
      attributes: input.attributes ?? {},
      confidence: this.clamp(input.confidence ?? 100),
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: input.correlationId,
      category: "node",
      action: "knowledge-node-registered",
      subjectId: node.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        type: node.type,
        domain: node.domain,
        version: node.version
      }
    });

    return node;
  }

  update(
    id: string,
    patch: {
      displayName?: string;
      description?: string;
      status?: KnowledgeNodeStatus;
      sourceSystem?: string;
      domain?: string;
      tags?: string[];
      attributes?: Record<string, unknown>;
      confidence?: number;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);

    const updated: KnowledgeNode = {
      ...current,
      ...patch,
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      attributes: {
        ...current.attributes,
        ...(patch.attributes ?? {})
      },
      confidence:
        patch.confidence === undefined
          ? current.confidence
          : this.clamp(patch.confidence),
      version: current.version + 1,
      updatedAt: new Date().toISOString()
    };

    this.nodes.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "node",
      action: "knowledge-node-updated",
      subjectId: id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        previousVersion: current.version,
        version: updated.version
      }
    });

    return updated;
  }

  resolve(name: string) {
    const normalized = name.trim().toLowerCase();

    return this.list().find(
      (node) =>
        node.id.toLowerCase() === normalized ||
        node.canonicalName.toLowerCase() === normalized ||
        node.displayName.toLowerCase() === normalized
    );
  }

  summary() {
    const nodes = this.list();

    return {
      total: nodes.length,
      active: nodes.filter(
        (node) => node.status === "active"
      ).length,
      capabilities: nodes.filter(
        (node) => node.type === "capability"
      ).length,
      products: nodes.filter(
        (node) => node.type === "product"
      ).length,
      workflows: nodes.filter(
        (node) => node.type === "workflow"
      ).length,
      decisions: nodes.filter(
        (node) => node.type === "decision"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }

  private slug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
