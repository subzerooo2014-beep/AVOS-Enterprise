import { Injectable } from "@nestjs/common";
import { DocumentationRegistryService } from "../registry/documentation-registry.service";
import { DocumentationBlueprintSyncService } from "../blueprint/documentation-blueprint-sync.service";
import { DocumentationIntelligenceReport, DocumentationRecommendation } from "../interfaces/documentation-intelligence.types";

@Injectable()
export class DocumentationIntelligenceService {
  private readonly reports = new Map<string, DocumentationIntelligenceReport[]>();

  constructor(
    private readonly registry: DocumentationRegistryService,
    private readonly blueprint: DocumentationBlueprintSyncService,
  ) {}

  analyze(documentId: string): DocumentationIntelligenceReport {
    const document = this.registry.findById(documentId);
    const binding = this.blueprint.evaluate(document);

    const completenessChecks = [
      document.title.trim().length > 0,
      document.owner.trim().length > 0,
      document.authority.trim().length > 0,
      document.appliesTo.length > 0,
      Object.keys(document.metadata).length > 0,
    ];
    const governanceChecks = [
      document.status === "approved" || document.status === "active",
      Boolean(document.approver),
      document.classification.trim().length > 0,
      document.authority.toLowerCase().includes("avos"),
    ];
    const linkageChecks = [
      document.dependsOn.length > 0 || document.relatedDocuments.length > 0,
      Boolean(binding),
      binding?.status === "synchronized",
    ];

    const updated = Date.parse(document.updatedAt);
    const ageDays = Number.isFinite(updated) ? Math.floor((Date.now() - updated) / 86400000) : 9999;
    const freshnessScore = ageDays <= 90 ? 100 : ageDays <= 180 ? 75 : ageDays <= 365 ? 50 : 25;
    const percentage = (checks: boolean[]) => Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const completenessScore = percentage(completenessChecks);
    const governanceScore = percentage(governanceChecks);
    const linkageScore = percentage(linkageChecks);
    const score = Math.round((completenessScore + governanceScore + linkageScore + freshnessScore) / 4);

    const findings: string[] = [];
    const recommendations: DocumentationRecommendation[] = [];
    const add = (category: DocumentationRecommendation["category"], priority: DocumentationRecommendation["priority"], message: string) => {
      findings.push(message);
      recommendations.push({
        id: `adf-recommendation:${document.id}:${Date.now()}:${recommendations.length + 1}`,
        documentId: document.id,
        category,
        priority,
        message,
        humanApprovalRequired: true,
        createdAt: new Date().toISOString(),
      });
    };

    if (completenessScore < 100) add("completeness", "medium", "Complete missing documentation identity, applicability, or metadata fields.");
    if (governanceScore < 100) add("governance", "high", "Complete approval and governance controls before treating this document as authoritative.");
    if (!binding) add("blueprint", "high", "Link this document to an AVOS Living Blueprint.");
    else if (binding.status === "drift-detected") add("blueprint", "critical", "Resolve detected drift between the document and its Living Blueprint binding.");
    if (linkageScore < 100) add("linkage", "medium", "Strengthen dependencies and related-document links.");
    if (freshnessScore < 100) add("freshness", "medium", "Schedule a human review because this document may be stale.");
    if (!findings.length) findings.push("Documentation is healthy, governed, current, and synchronized.");

    const level = score >= 90 ? "excellent" : score >= 75 ? "healthy" : score >= 50 ? "attention" : "critical";
    const existing = this.reports.get(document.id) || [];
    const report: DocumentationIntelligenceReport = {
      id: `adf-intelligence:${document.id}:${Date.now()}:${existing.length + 1}`,
      documentId: document.id,
      score,
      level,
      completenessScore,
      governanceScore,
      linkageScore,
      freshnessScore,
      findings,
      recommendations,
      analyzedAt: new Date().toISOString(),
    };
    this.reports.set(document.id, [...existing, report]);
    return report;
  }

  analyzeAll(): DocumentationIntelligenceReport[] {
    return this.registry.list().map((document) => this.analyze(document.id));
  }

  list(documentId?: string): DocumentationIntelligenceReport[] {
    if (documentId) return [...(this.reports.get(documentId) || [])];
    return Array.from(this.reports.values()).flat().sort((a, b) => a.analyzedAt.localeCompare(b.analyzedAt));
  }

  latest(documentId: string): DocumentationIntelligenceReport | undefined {
    const items = this.reports.get(documentId) || [];
    return items.length ? items[items.length - 1] : undefined;
  }

  count(): number { return this.list().length; }
}
