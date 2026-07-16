import { Injectable } from "@nestjs/common";
import {
  KnowledgeQualityFinding
} from "../foundation-pack-13.types";
import { KnowledgeNodeRegistryService } from "../nodes/knowledge-node-registry.service";
import { KnowledgeRelationshipRegistryService } from "../relationships/knowledge-relationship-registry.service";
import { KnowledgeGraphAuditService } from "../observability/knowledge-graph-audit.service";

@Injectable()
export class KnowledgeGraphQualityService {
  private readonly findings:
    KnowledgeQualityFinding[] = [];

  constructor(
    private readonly nodes: KnowledgeNodeRegistryService,
    private readonly relationships: KnowledgeRelationshipRegistryService,
    private readonly audit: KnowledgeGraphAuditService
  ) {}

  validate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    this.findings.length = 0;

    const nodes = this.nodes.list();

    for (const node of nodes) {
      const incoming = this.relationships.incoming(node.id);
      const outgoing = this.relationships.outgoing(node.id);

      if (
        incoming.length === 0 &&
        outgoing.length === 0
      ) {
        this.add(
          "warning",
          "orphan-node",
          node.id,
          `Knowledge node is isolated: ${node.id}.`,
          []
        );
      }

      if (node.description.trim().length === 0) {
        this.add(
          "error",
          "missing-description",
          node.id,
          `Knowledge node has no description: ${node.id}.`,
          []
        );
      }

      if (node.confidence < 40) {
        this.add(
          "warning",
          "low-confidence",
          node.id,
          `Knowledge node confidence is low: ${node.confidence}.`,
          []
        );
      }

      const duplicates = nodes.filter(
        (candidate) =>
          candidate.id !== node.id &&
          candidate.type === node.type &&
          candidate.canonicalName.toLowerCase() ===
            node.canonicalName.toLowerCase()
      );

      if (duplicates.length > 0) {
        this.add(
          "error",
          "duplicate-node",
          node.id,
          `Duplicate semantic node detected for ${node.canonicalName}.`,
          duplicates.map((item) => item.id)
        );
      }
    }

    for (const relationship of this.relationships.list()) {
      try {
        this.nodes.get(relationship.fromNodeId);
        this.nodes.get(relationship.toNodeId);
      }
      catch {
        this.add(
          "critical",
          "invalid-relationship",
          relationship.id,
          `Relationship references a missing node: ${relationship.id}.`,
          [
            relationship.fromNodeId,
            relationship.toNodeId
          ]
        );
      }
    }

    for (const cycle of this.detectCycles()) {
      this.add(
        "warning",
        "circular-relationship",
        cycle[0] ?? "unknown",
        `Circular semantic relationship detected: ${cycle.join(" -> ")}.`,
        cycle
      );
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "quality",
      action: "knowledge-quality-validated",
      subjectId: "enterprise-knowledge-graph",
      actorIdentityId: input.actorIdentityId,
      outcome:
        this.findings.some(
          (finding) =>
            finding.severity === "critical" ||
            finding.severity === "error"
        )
          ? "failure"
          : this.findings.length > 0
            ? "warning"
            : "success",
      metadata: {
        findings: this.findings.length
      }
    });

    return {
      valid: !this.findings.some(
        (finding) =>
          finding.severity === "critical" ||
          finding.severity === "error"
      ),
      findings: [...this.findings],
      checkedAt: new Date().toISOString()
    };
  }

  list() {
    return [...this.findings];
  }

  summary() {
    return {
      total: this.findings.length,
      critical: this.findings.filter(
        (finding) => finding.severity === "critical"
      ).length,
      errors: this.findings.filter(
        (finding) => finding.severity === "error"
      ).length,
      warnings: this.findings.filter(
        (finding) => finding.severity === "warning"
      ).length
    };
  }

  private detectCycles() {
    const graph = new Map<string, string[]>();

    for (const node of this.nodes.list()) {
      graph.set(node.id, []);
    }

    for (const relationship of this.relationships.list()) {
      const list =
        graph.get(relationship.fromNodeId) ?? [];

      list.push(relationship.toNodeId);
      graph.set(relationship.fromNodeId, list);
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const cycles: string[][] = [];

    const visit = (id: string, path: string[]) => {
      if (visiting.has(id)) {
        const index = path.indexOf(id);
        cycles.push([...path.slice(index), id]);
        return;
      }

      if (visited.has(id)) {
        return;
      }

      visiting.add(id);
      path.push(id);

      for (const next of graph.get(id) ?? []) {
        visit(next, [...path]);
      }

      visiting.delete(id);
      visited.add(id);
    };

    for (const node of this.nodes.list()) {
      visit(node.id, []);
    }

    return cycles;
  }

  private add(
    severity: KnowledgeQualityFinding["severity"],
    code: KnowledgeQualityFinding["code"],
    subjectId: string,
    message: string,
    relatedIds: string[]
  ) {
    this.findings.push({
      id: `knowledge-quality:${Date.now()}:${
        this.findings.length + 1
      }`,
      severity,
      code,
      subjectId,
      message,
      relatedIds,
      createdAt: new Date().toISOString()
    });
  }
}
