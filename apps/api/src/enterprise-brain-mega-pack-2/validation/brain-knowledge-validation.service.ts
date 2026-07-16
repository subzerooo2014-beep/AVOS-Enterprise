import { Injectable } from "@nestjs/common";
import { BrainKnowledgeValidationReport } from "../enterprise-brain-mega-pack-2.types";
import { BrainKnowledgeGraphService } from "../knowledge/brain-knowledge-graph.service";
import { BrainOntologyRegistryService } from "../ontology/brain-ontology-registry.service";
import { BrainKnowledgeAuditService } from "../observability/brain-knowledge-audit.service";

@Injectable()
export class BrainKnowledgeValidationService {
  private readonly reports =
    new Map<string, BrainKnowledgeValidationReport>();

  constructor(
    private readonly graph: BrainKnowledgeGraphService,
    private readonly ontologies: BrainOntologyRegistryService,
    private readonly audit: BrainKnowledgeAuditService
  ) {}

  list() {
    return Array.from(this.reports.values());
  }

  run(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const nodes = this.graph.listNodes();
    const relations = this.graph.listRelations();

    const connectedNodeIds = new Set(
      relations.flatMap((relation) => [
        relation.fromNodeId,
        relation.toNodeId
      ])
    );

    const orphanNodes = nodes
      .filter(
        (node) =>
          node.active &&
          !connectedNodeIds.has(node.id) &&
          nodes.length > 1
      )
      .map((node) => node.id);

    const duplicateNodes: string[] = [];

    for (const node of nodes) {
      const duplicates = nodes.filter(
        (candidate) =>
          candidate.id !== node.id &&
          candidate.type === node.type &&
          candidate.name.toLowerCase() === node.name.toLowerCase()
      );

      if (duplicates.length > 0) {
        duplicateNodes.push(node.id);
      }
    }

    const brokenRelations = relations
      .filter((relation) => {
        try {
          this.graph.getNode(relation.fromNodeId);
          this.graph.getNode(relation.toNodeId);
          return false;
        }
        catch {
          return true;
        }
      })
      .map((relation) => relation.id);

    const contradictions = relations
      .filter((relation) => relation.type === "contradicts")
      .map((relation) => relation.id);

    const warnings: string[] = [];

    if (this.ontologies.summary().active === 0) {
      warnings.push("No active brain ontology exists.");
    }

    const deductions =
      orphanNodes.length * 5 +
      duplicateNodes.length * 10 +
      brokenRelations.length * 20 +
      contradictions.length * 5;

    const score = Math.max(0, 100 - deductions);

    const report: BrainKnowledgeValidationReport = {
      id: `brain-knowledge-validation:${Date.now()}:${this.reports.size + 1}`,
      valid:
        brokenRelations.length === 0 &&
        duplicateNodes.length === 0 &&
        score >= 80,
      score,
      orphanNodes:
        Array.from(new Set(orphanNodes)),
      duplicateNodes:
        Array.from(new Set(duplicateNodes)),
      brokenRelations:
        Array.from(new Set(brokenRelations)),
      contradictions:
        Array.from(new Set(contradictions)),
      warnings,
      createdAt: new Date().toISOString()
    };

    this.reports.set(report.id, report);

    this.audit.record({
      correlationId: input.correlationId,
      category: "validation",
      action: "brain-knowledge-validation-completed",
      subjectId: report.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        report.valid
          ? "success"
          : "warning",
      metadata: {
        score: report.score,
        orphanNodes: report.orphanNodes.length,
        brokenRelations: report.brokenRelations.length
      }
    });

    return report;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      valid: items.filter((x) => x.valid).length,
      latestScore: this.latest()?.score ?? 0
    };
  }
}
