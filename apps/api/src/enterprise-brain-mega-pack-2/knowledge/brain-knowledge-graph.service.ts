import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  BrainKnowledgeNode,
  BrainKnowledgeRelation
} from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainKnowledgeGraphService {
  private readonly nodes = new Map<string, BrainKnowledgeNode>();
  private readonly relations = new Map<string, BrainKnowledgeRelation>();

  constructor(
    private readonly audit: BrainKnowledgeAuditService
  ) {
    this.seed();
  }

  listNodes() {
    return Array.from(this.nodes.values());
  }

  listRelations() {
    return Array.from(this.relations.values());
  }

  getNode(id: string) {
    const node = this.nodes.get(id);

    if (!node) {
      throw new NotFoundException(`Brain knowledge node not found: ${id}`);
    }

    return node;
  }

  getRelation(id: string) {
    const relation = this.relations.get(id);

    if (!relation) {
      throw new NotFoundException(`Brain knowledge relation not found: ${id}`);
    }

    return relation;
  }

  createNode(
    input: Omit<BrainKnowledgeNode, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    if (this.nodes.has(input.id)) {
      throw new ConflictException(`Brain knowledge node already exists: ${input.id}`);
    }

    const duplicate = this.listNodes().find(
      (node) =>
        node.type === input.type &&
        node.name.toLowerCase() === input.name.toLowerCase()
    );

    if (duplicate) {
      throw new ConflictException(
        `Brain knowledge node with same name and type already exists: ${duplicate.id}`
      );
    }

    const now = new Date().toISOString();

    const node: BrainKnowledgeNode = {
      ...input,
      aliases: Array.from(new Set(input.aliases)),
      tags: Array.from(new Set(input.tags)),
      sourceIds: Array.from(new Set(input.sourceIds)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      createdAt: now,
      updatedAt: now
    };

    this.nodes.set(node.id, node);

    this.audit.record({
      correlationId: context.correlationId,
      category: "knowledge",
      action: "brain-knowledge-node-created",
      subjectId: node.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        type: node.type,
        confidence: node.confidence
      }
    });

    return node;
  }

  updateNode(
    id: string,
    patch: Partial<Omit<BrainKnowledgeNode, "id" | "createdAt">>,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.getNode(id);

    const updated: BrainKnowledgeNode = {
      ...current,
      ...patch,
      aliases:
        patch.aliases === undefined
          ? current.aliases
          : Array.from(new Set(patch.aliases)),
      tags:
        patch.tags === undefined
          ? current.tags
          : Array.from(new Set(patch.tags)),
      sourceIds:
        patch.sourceIds === undefined
          ? current.sourceIds
          : Array.from(new Set(patch.sourceIds)),
      properties: {
        ...current.properties,
        ...(patch.properties ?? {})
      },
      updatedAt: new Date().toISOString()
    };

    this.nodes.set(updated.id, updated);
    return updated;
  }

  createRelation(
    input: Omit<BrainKnowledgeRelation, "createdAt" | "updatedAt">,
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    this.getNode(input.fromNodeId);
    this.getNode(input.toNodeId);

    if (this.relations.has(input.id)) {
      throw new ConflictException(`Brain knowledge relation already exists: ${input.id}`);
    }

    const now = new Date().toISOString();

    const relation: BrainKnowledgeRelation = {
      ...input,
      weight: Math.max(0, Math.min(100, input.weight)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      evidenceIds: Array.from(new Set(input.evidenceIds)),
      createdAt: now,
      updatedAt: now
    };

    this.relations.set(relation.id, relation);

    this.audit.record({
      correlationId: context.correlationId,
      category: "relation",
      action: "brain-knowledge-relation-created",
      subjectId: relation.id,
      actorIdentityId: context.actorIdentityId,
      outcome: "success",
      metadata: {
        fromNodeId: relation.fromNodeId,
        toNodeId: relation.toNodeId,
        type: relation.type
      }
    });

    return relation;
  }

  neighbors(nodeId: string) {
    this.getNode(nodeId);

    const relations = this.listRelations().filter(
      (relation) =>
        relation.active &&
        (
          relation.fromNodeId === nodeId ||
          relation.toNodeId === nodeId
        )
    );

    const nodeIds = Array.from(
      new Set(
        relations.flatMap((relation) => [
          relation.fromNodeId,
          relation.toNodeId
        ])
      )
    ).filter((id) => id !== nodeId);

    return {
      node: this.getNode(nodeId),
      relations,
      neighbors: nodeIds.map((id) => this.getNode(id))
    };
  }

  summary() {
    const nodes = this.listNodes();
    const relations = this.listRelations();

    return {
      nodes: nodes.length,
      activeNodes: nodes.filter((x) => x.active).length,
      relations: relations.length,
      activeRelations: relations.filter((x) => x.active).length,
      concepts: nodes.filter((x) => x.type === "concept").length,
      capabilities: nodes.filter((x) => x.type === "capability").length,
      memories: nodes.filter((x) => x.type === "memory").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const nodes: BrainKnowledgeNode[] = [
      {
        id: "knowledge:enterprise-brain",
        type: "concept",
        name: "Enterprise Brain",
        description: "Core enterprise intelligence layer.",
        aliases: ["AVOS Brain"],
        properties: {},
        tags: ["brain", "intelligence"],
        sourceIds: ["enterprise-brain-mega-pack-1"],
        confidence: 100,
        active: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "knowledge:enterprise-kernel",
        type: "concept",
        name: "Enterprise Kernel",
        description: "Certified AVOS enterprise kernel.",
        aliases: [],
        properties: {},
        tags: ["kernel", "foundation"],
        sourceIds: ["enterprise-kernel-v7"],
        confidence: 100,
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const node of nodes) {
      this.nodes.set(node.id, node);
    }

    const relation: BrainKnowledgeRelation = {
      id: "relation:brain-depends-on-kernel",
      fromNodeId: "knowledge:enterprise-brain",
      toNodeId: "knowledge:enterprise-kernel",
      type: "depends-on",
      weight: 100,
      confidence: 100,
      evidenceIds: [],
      metadata: {},
      active: true,
      createdAt: now,
      updatedAt: now
    };

    this.relations.set(relation.id, relation);
  }
}
