import { Injectable } from "@nestjs/common";
import {
  FoundationRecommendation
} from "../foundation-pack-18.types";
import { FoundationSelfValidationService } from "../validation/foundation-self-validation.service";
import { FoundationReadinessService } from "../readiness/foundation-readiness.service";
import { FoundationValidationAuditService } from "../observability/foundation-validation-audit.service";

@Injectable()
export class FoundationRecommendationService {
  private readonly recommendations =
    new Map<string, FoundationRecommendation>();

  constructor(
    private readonly validation: FoundationSelfValidationService,
    private readonly readiness: FoundationReadinessService,
    private readonly audit: FoundationValidationAuditService
  ) {}

  list() {
    return Array.from(this.recommendations.values());
  }

  generate(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const generated: FoundationRecommendation[] = [];

    for (const finding of this.validation.list()) {
      const recommendation =
        this.create(
          finding.severity === "critical"
            ? "critical"
            : finding.severity === "error"
              ? "high"
              : "medium",
          finding.code.includes("dependency")
            ? "dependency"
            : "component",
          `Resolve ${finding.code}`,
          finding.message,
          [
            finding.componentId,
            ...finding.relatedIds
          ],
          [
            "Foundation completeness is required before higher layers.",
            "Foundation consistency must be preserved."
          ]
        );

      generated.push(recommendation);
    }

    const readinessItems = this.readiness.list();

    const latestReadiness =
      readinessItems.length === 0
        ? undefined
        : readinessItems[readinessItems.length - 1];

    if (latestReadiness && !latestReadiness.ready) {
      const recommendation = this.create(
        "critical",
        "readiness",
        "Resolve foundation readiness blockers",
        latestReadiness.blockers.join(" "),
        [],
        [
          "The platform must not advance beyond Foundation until ready."
        ]
      );

      generated.push(recommendation);
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "recommendation",
      action: "foundation-recommendations-generated",
      subjectId: "foundation",
      actorIdentityId: input.actorIdentityId,
      outcome:
        generated.some(
          (item) =>
            item.priority === "critical" ||
            item.priority === "high"
        )
          ? "warning"
          : "success",
      metadata: {
        generated: generated.length
      }
    });

    return {
      generated,
      createdAt: new Date().toISOString()
    };
  }

  updateStatus(
    id: string,
    status: FoundationRecommendation["status"]
  ) {
    const current = this.recommendations.get(id);

    if (!current) {
      throw new Error(
        `Foundation recommendation not found: ${id}`
      );
    }

    const updated: FoundationRecommendation = {
      ...current,
      status,
      updatedAt: new Date().toISOString()
    };

    this.recommendations.set(id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      open: items.filter(
        (item) => item.status === "open"
      ).length,
      critical: items.filter(
        (item) => item.priority === "critical"
      ).length,
      implemented: items.filter(
        (item) => item.status === "implemented"
      ).length
    };
  }

  private create(
    priority: FoundationRecommendation["priority"],
    category: FoundationRecommendation["category"],
    title: string,
    description: string,
    relatedComponentIds: string[],
    rationale: string[]
  ) {
    const recommendation: FoundationRecommendation = {
      id: `foundation-recommendation:${Date.now()}:${
        this.recommendations.size + 1
      }`,
      priority,
      category,
      title,
      description,
      relatedComponentIds: Array.from(
        new Set(relatedComponentIds)
      ),
      rationale,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.recommendations.set(
      recommendation.id,
      recommendation
    );

    return recommendation;
  }
}
