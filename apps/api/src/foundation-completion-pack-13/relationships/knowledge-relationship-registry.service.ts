import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  KnowledgeRelationship,
  KnowledgeRelationshipType
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeRelationshipRegistryService {
  private readonly relationships =
    new Map<string, KnowledgeRelationship>();

  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  list() {
    return Array.from(this.relationships.values());
  }

  get(id: string) {
    const relationship = this.relationships.get(id);

    if (!relationship) {
      throw new NotFoundException(
        `Knowledge relationship not found: ${id}`
      );
    }

    return relationship;
  }

  register(input: {
    fromNodeId: string;
    toNodeId: string;
    type: KnowledgeRelationshipType;
    label: string;
    strength?: number;
    confidence?: number;
    bidirectional?: boolean;
    metadata?: Record<string, unknown>;
    correlationId: string;
    actorIdentityId: string;
  }) {
    if (input.fromNodeId === input.toNodeId) {
      throw new BadRequestException(
        "A knowledge node cannot relate to itself."
      );
    }

    this.nodes.get(input.fromNodeId);
    this.nodes.get(input.toNodeId);

    const duplicate = this.list().find(
      (relationship) =>
        relationship.fromNodeId === input.fromNodeId &&
        relationship.toNodeId === input.toNodeId &&
        relationship.type === input.type
    );

    if (duplicate) {
      return duplicate;
    }

    const now = new Date().toISOString();

    const relationship: KnowledgeRelationship = {
      id: `knowledge-relationship:${Date.now()}:${
        this.relationships.size + 1
      }`,
      fromNodeId: input.fromNodeId,
      toNodeId: input.toNodeId,
      type: input.type,
      label: input.label,
      strength: this.clamp(input.strength ?? 100),
      confidence: this.clamp(input.confidence ?? 100),
      bidirectional: input.bidirectional ?? false,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.relationships.set(
      relationship.id,
      relationship
    );

    this.audit.record({
      correlationId: input.correlationId,
      category: "relationship",
      action: "knowledge-relationship-registered",
      subjectId: relationship.id,
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        fromNodeId: relationship.fromNodeId,
        toNodeId: relationship.toNodeId,
        type: relationship.type
      }
    });

    return relationship;
  }

  incoming(nodeId: string) {
    this.nodes.get(nodeId);

    return this.list().filter(
      (relationship) =>
        relationship.toNodeId === nodeId ||
        (
          relationship.bidirectional &&
          relationship.fromNodeId === nodeId
        )
    );
  }

  outgoing(nodeId: string) {
    this.nodes.get(nodeId);

    return this.list().filter(
      (relationship) =>
        relationship.fromNodeId === nodeId ||
        (
          relationship.bidirectional &&
          relationship.toNodeId === nodeId
        )
    );
  }

  neighborhood(nodeId: string) {
    const node = this.nodes.get(nodeId);
    const incoming = this.incoming(nodeId);
    const outgoing = this.outgoing(nodeId);

    const relatedIds = Array.from(
      new Set([
        ...incoming.map((relationship) =>
          relationship.fromNodeId === nodeId
            ? relationship.toNodeId
            : relationship.fromNodeId
        ),
        ...outgoing.map((relationship) =>
          relationship.fromNodeId === nodeId
            ? relationship.toNodeId
            : relationship.fromNodeId
        )
      ])
    );

    return {
      node,
      incoming,
      outgoing,
      relatedNodes: relatedIds.map((id) =>
        this.nodes.get(id)
      )
    };
  }

  summary() {
    const relationships = this.list();

    return {
      total: relationships.length,
      dependencies: relationships.filter(
        (relationship) =>
          relationship.type === "depends-on"
      ).length,
      governance: relationships.filter(
        (relationship) =>
          relationship.type === "governed-by"
      ).length,
      ownership: relationships.filter(
        (relationship) =>
          relationship.type === "owned-by"
      ).length,
      semantic: relationships.filter(
        (relationship) =>
          relationship.type === "related-to"
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
