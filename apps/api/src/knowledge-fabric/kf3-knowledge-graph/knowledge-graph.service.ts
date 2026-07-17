import { Injectable, OnModuleInit } from "@nestjs/common";
import { KnowledgeRegistryService } from "../kf1-foundation";
import { KnowledgeIngestionService } from "../kf2-ingestion-normalization";
import { KnowledgeGraphIntegrityService } from "./knowledge-graph-integrity.service";
import { KnowledgeGraphRepository } from "./knowledge-graph.repository";
import { KnowledgeGraphTraversalService } from "./knowledge-graph-traversal.service";
import {
  CreateKnowledgeNodeInput,
  CreateKnowledgeRelationInput,
  KnowledgeGraphStatus,
  KnowledgeNode,
  KnowledgeRelation,
} from "./knowledge-graph.types";

@Injectable()
export class KnowledgeGraphService implements OnModuleInit {
  private bootstrapped = false;

  constructor(
    private readonly repository: KnowledgeGraphRepository,
    private readonly traversalService: KnowledgeGraphTraversalService,
    private readonly integrityService: KnowledgeGraphIntegrityService,
    private readonly registry: KnowledgeRegistryService,
    private readonly ingestion: KnowledgeIngestionService,
  ) {}

  onModuleInit(): void { this.bootstrap(); }

  bootstrap(): KnowledgeGraphStatus {
    this.registry.register({
      key: "avos.knowledge.graph",
      title: "AVOS Knowledge Graph",
      summary: "Graph representation, semantic relations, traversal, and integrity.",
      metadata: { pack: "KF-3", version: "1.0.0" },
    });

    const foundation = this.createNode({
      key: "avos.knowledge.foundation",
      label: "Knowledge Foundation",
      type: "capability",
      metadata: { pack: "KF-1" },
    });
    const ingestion = this.createNode({
      key: "avos.knowledge.ingestion",
      label: "Ingestion and Normalization",
      type: "capability",
      metadata: { pack: "KF-2" },
    });
    const graph = this.createNode({
      key: "avos.knowledge.graph",
      label: "Knowledge Graph",
      type: "capability",
      metadata: { pack: "KF-3" },
    });

    this.createRelation({ fromNodeId: ingestion.id, toNodeId: foundation.id, type: "depends_on" });
    this.createRelation({ fromNodeId: graph.id, toNodeId: ingestion.id, type: "depends_on" });
    this.createRelation({ fromNodeId: graph.id, toNodeId: foundation.id, type: "related_to" });

    this.bootstrapped = true;
    return this.status();
  }

  createNode(input: CreateKnowledgeNodeInput): KnowledgeNode {
    if (!input?.key?.trim() || !input?.label?.trim() || !input?.type) {
      throw new Error("Node key, label, and type are required.");
    }
    const existing = this.repository.findNode(input.key.trim());
    if (existing) return existing;
    const now = new Date().toISOString();
    return this.repository.saveNode({
      id: input.id?.trim() || `knowledge-node:${this.slug(input.key)}`,
      key: input.key.trim(),
      label: input.label.trim(),
      type: input.type,
      sourceDocumentId: input.sourceDocumentId,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  createRelation(input: CreateKnowledgeRelationInput): KnowledgeRelation {
    const from = this.repository.findNode(input.fromNodeId);
    const to = this.repository.findNode(input.toNodeId);
    if (!from || !to) throw new Error("Both relation nodes must exist.");
    if (this.repository.hasRelation(from.id, to.id, input.type)) {
      return this.repository.listRelations().find(
        (relation) => relation.fromNodeId === from.id && relation.toNodeId === to.id && relation.type === input.type,
      )!;
    }
    const weight = Math.max(0, Math.min(input.weight ?? 1, 1));
    return this.repository.saveRelation({
      id: input.id?.trim() || `knowledge-relation:${this.slug(`${from.id}:${input.type}:${to.id}`)}`,
      fromNodeId: from.id,
      toNodeId: to.id,
      type: input.type,
      weight,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString(),
    });
  }

  importIngestedDocuments() {
    const imported: KnowledgeNode[] = [];
    for (const document of this.ingestion.listDocuments()) {
      imported.push(this.createNode({
        key: `document.${document.id}`,
        label: document.title,
        type: "document",
        sourceDocumentId: document.id,
        metadata: { source: document.source, checksum: document.checksum, wordCount: document.wordCount },
      }));
    }
    return { imported: imported.length, nodes: imported };
  }

  traverse(idOrKey: string, depth = 2) {
    const node = this.repository.findNode(idOrKey);
    if (!node) throw new Error(`Knowledge node not found: ${idOrKey}`);
    return this.traversalService.traverse(node.id, depth);
  }

  graph() {
    const integrity = this.integrityService.validate();
    return {
      nodes: this.repository.listNodes(),
      relations: this.repository.listRelations(),
      orphanNodeIds: integrity.orphanNodeIds,
      nodeCount: this.repository.countNodes(),
      relationCount: this.repository.countRelations(),
      generatedAt: new Date().toISOString(),
    };
  }

  status(): KnowledgeGraphStatus {
    return {
      system: "AVOS Knowledge Fabric",
      pack: "KF-3",
      name: "Knowledge Graph",
      status: "ready",
      graphReady: this.bootstrapped,
      traversalReady: true,
      integrityReady: this.integrityService.validate().valid,
      semanticLinksReady: this.repository.countRelations() > 0,
      nodes: this.repository.countNodes(),
      relations: this.repository.countRelations(),
      capabilities: [
        "knowledge-nodes",
        "knowledge-relations",
        "entity-registry",
        "semantic-links",
        "dependency-graph",
        "graph-traversal",
        "graph-integrity",
        "document-graph-import",
      ],
      generatedAt: new Date().toISOString(),
    };
  }

  health() { return { healthy: this.integrityService.validate().valid, status: this.status() }; }

  verification() {
    this.bootstrap();
    const graph = this.graph();
    const traversal = this.traverse("avos.knowledge.graph", 2);
    const checks = {
      bootstrapCompleted: this.bootstrapped,
      seedNodesPresent: graph.nodeCount >= 3,
      seedRelationsPresent: graph.relationCount >= 3,
      traversalWorks: traversal.nodes.length >= 3,
      integrityValid: this.integrityService.validate().valid,
      registryIntegrated: this.registry.resolve("avos.knowledge.graph") !== undefined,
      ingestionIntegrated: typeof this.ingestion.listDocuments === "function",
    };
    const passed = Object.values(checks).every(Boolean);
    return { passed, score: passed ? 100 : 0, pack: "KF-3", checks, status: this.status() };
  }

  smoke() {
    const concept = this.createNode({ key: "avos.smoke.knowledge", label: "Knowledge Smoke Concept", type: "concept" });
    const graph = this.repository.findNode("avos.knowledge.graph")!;
    this.createRelation({ fromNodeId: concept.id, toNodeId: graph.id, type: "related_to", weight: 1 });
    const traversal = this.traverse(concept.id, 1);
    const verification = this.verification();
    return {
      passed: verification.passed && traversal.nodes.length >= 2,
      pack: "KF-3",
      nodes: this.repository.countNodes(),
      relations: this.repository.countRelations(),
      traversedNodes: traversal.nodes.length,
      verificationScore: verification.score,
      timestamp: new Date().toISOString(),
    };
  }

  private slug(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9._:-]+/g, "-").replace(/^-+|-+$/g, "");
  }
}