import { Injectable, OnModuleInit } from "@nestjs/common";
import { DocumentationKnowledgeSyncService } from "./documentation-knowledge-sync.service";
import { DocumentationSemanticLinkService } from "./documentation-semantic-link.service";
import {
  DocumentationGraphLink,
  DocumentationGraphNode,
  DocumentationGraphSnapshot,
} from "./documentation-graph.types";

@Injectable()
export class DocumentationGraphService implements OnModuleInit {
  private readonly version = "ADF-MP4-1.0.0";
  private nodes: DocumentationGraphNode[] = [];
  private links: DocumentationGraphLink[] = [];
  private rebuiltAt: string | null = null;

  constructor(
    private readonly semanticLinks: DocumentationSemanticLinkService,
    private readonly knowledgeSync: DocumentationKnowledgeSyncService,
  ) {}

  onModuleInit(): void {
    this.rebuild();
  }

  status() {
    return {
      name: "AVOS Documentation Knowledge Graph",
      version: this.version,
      status: "operational",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      metrics: {
        nodes: this.nodes.length,
        links: this.links.length,
        semanticLinks: this.links.filter((link) => link.kind === "semantic").length,
        knowledgeSynchronizations: this.knowledgeSync.history().length,
      },
      rebuiltAt: this.rebuiltAt,
    };
  }

  rebuild() {
    const now = new Date().toISOString();
    this.nodes = this.seedNodes(now);
    this.links = this.structuralLinks(now);
    this.rebuiltAt = now;

    return {
      id: `documentation-graph-rebuild:${Date.now()}`,
      status: "completed",
      version: this.version,
      nodes: this.nodes.length,
      links: this.links.length,
      rebuiltAt: this.rebuiltAt,
      humanFinalAuthority: true,
    };
  }

  generateSemanticLinks(minimumSimilarity = 0.1) {
    const generated = this.semanticLinks.generate(
      this.nodes,
      minimumSimilarity,
    );

    this.links = [
      ...this.links.filter((link) => link.kind !== "semantic"),
      ...generated,
    ];

    return {
      id: `documentation-semantic-links:${Date.now()}`,
      status: "completed",
      minimumSimilarity,
      generated: generated.length,
      totalLinks: this.links.length,
      links: generated,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
    };
  }

  synchronizeKnowledge(synchronizedBy: string) {
    return {
      status: "completed",
      synchronization: this.knowledgeSync.synchronize(
        this.snapshot(),
        synchronizedBy,
      ),
    };
  }

  snapshot(): DocumentationGraphSnapshot {
    return {
      version: this.version,
      nodes: [...this.nodes],
      links: [...this.links],
      rebuiltAt: this.rebuiltAt,
    };
  }

  private seedNodes(now: string): DocumentationGraphNode[] {
    return [
      this.node(
        "documentation-framework",
        "AVOS Documentation Framework",
        "framework",
        "Core documentation registry, validation, search, metrics and verification.",
        ["documentation", "framework", "registry", "validation", "search"],
        now,
      ),
      this.node(
        "documentation-governance",
        "Documentation Governance",
        "governance",
        "Versions, reviews, lifecycle transitions, certification and audit.",
        ["documentation", "governance", "review", "certification", "audit"],
        now,
      ),
      this.node(
        "documentation-intelligence",
        "Documentation Intelligence",
        "intelligence",
        "Documentation analysis, quality intelligence and orchestration.",
        ["documentation", "intelligence", "analysis", "quality", "orchestration"],
        now,
      ),
      this.node(
        "documentation-blueprint",
        "Documentation Blueprint Synchronization",
        "blueprint",
        "Binds documentation to AVOS Living Blueprint and synchronizes changes.",
        ["documentation", "blueprint", "synchronization", "architecture"],
        now,
      ),
      this.node(
        "living-documentation",
        "Living Documentation",
        "living-documentation",
        "Maintains documentation snapshots and continuously synchronized state.",
        ["documentation", "living", "snapshot", "synchronization"],
        now,
      ),
      this.node(
        "knowledge-fabric",
        "AVOS Knowledge Fabric Integration",
        "knowledge",
        "Synchronizes documentation knowledge with enterprise knowledge capabilities.",
        ["documentation", "knowledge", "fabric", "synchronization", "enterprise"],
        now,
      ),
    ];
  }

  private structuralLinks(now: string): DocumentationGraphLink[] {
    return [
      this.link("documentation-framework", "documentation-governance", "contains", now),
      this.link("documentation-governance", "documentation-framework", "governs", now),
      this.link("documentation-intelligence", "documentation-framework", "analyzes", now),
      this.link("documentation-blueprint", "living-documentation", "synchronizes", now),
      this.link("living-documentation", "knowledge-fabric", "synchronizes", now),
    ];
  }

  private node(
    id: string,
    title: string,
    kind: DocumentationGraphNode["kind"],
    description: string,
    keywords: string[],
    now: string,
  ): DocumentationGraphNode {
    return {
      id,
      title,
      kind,
      description,
      keywords,
      metadata: {
        foundationFirst: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
      },
      createdAt: now,
      updatedAt: now,
    };
  }

  private link(
    sourceId: string,
    targetId: string,
    kind: DocumentationGraphLink["kind"],
    now: string,
  ): DocumentationGraphLink {
    return {
      id: `${kind}:${sourceId}:${targetId}`,
      sourceId,
      targetId,
      kind,
      similarity: 1,
      generatedBy: "avos-documentation-graph-rebuild-engine",
      createdAt: now,
    };
  }
}