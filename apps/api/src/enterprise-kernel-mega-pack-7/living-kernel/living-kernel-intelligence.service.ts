import { Injectable } from "@nestjs/common";
import {
  LivingKernelObservation,
  LivingKernelPattern,
  LivingKernelRecommendation
} from "../enterprise-kernel-mega-pack-7.types";
import { KernelObservabilityService } from "../observability/kernel-observability.service";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class LivingKernelIntelligenceService {
  private readonly observations =
    new Map<string, LivingKernelObservation>();

  private readonly patterns =
    new Map<string, LivingKernelPattern>();

  private readonly recommendations =
    new Map<string, LivingKernelRecommendation>();

  constructor(
    private readonly observability: KernelObservabilityService,
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  observe(input: {
    category: LivingKernelObservation["category"];
    source: string;
    signal: string;
    score: number;
    severity: LivingKernelObservation["severity"];
    details?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const observation: LivingKernelObservation = {
      id: `living-kernel-observation:${Date.now()}:${this.observations.size + 1}`,
      category: input.category,
      source: input.source,
      signal: input.signal,
      score: Math.max(0, Math.min(100, input.score)),
      severity: input.severity,
      details: input.details ?? {},
      observedAt: new Date().toISOString()
    };

    this.observations.set(observation.id, observation);

    this.observability.addTimeline({
      category: "runtime",
      event: "living-kernel-observation",
      subjectId: observation.id,
      status: observation.severity,
      correlationId: input.correlationId,
      details: {
        category: observation.category,
        signal: observation.signal,
        score: observation.score
      }
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "living-kernel",
      action: "living-kernel-observation-recorded",
      subjectId: observation.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        observation.severity === "critical" ||
        observation.severity === "error"
          ? "warning"
          : "success",
      metadata: {
        category: observation.category,
        score: observation.score
      }
    });

    return observation;
  }

  analyze(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const observations = Array.from(this.observations.values());
    const byCategory = new Map<string, LivingKernelObservation[]>();

    for (const observation of observations) {
      const group = byCategory.get(observation.category) ?? [];
      group.push(observation);
      byCategory.set(observation.category, group);
    }

    const detected: LivingKernelPattern[] = [];

    for (const [category, group] of byCategory) {
      const average =
        group.length === 0
          ? 100
          : group.reduce((sum, item) => sum + item.score, 0) / group.length;

      const severe = group.filter(
        (item) =>
          item.severity === "critical" ||
          item.severity === "error"
      );

      if (average < 80 || severe.length > 0) {
        const pattern: LivingKernelPattern = {
          id: `living-kernel-pattern:${Date.now()}:${this.patterns.size + 1}`,
          name: `${category}-weakness-pattern`,
          category,
          observationIds: group.map((item) => item.id),
          confidence: Math.min(100, 70 + group.length * 5),
          impact:
            severe.some((item) => item.severity === "critical")
              ? "critical"
              : average < 50
                ? "high"
                : average < 70
                  ? "medium"
                  : "low",
          explanation:
            `Living Kernel detected a ${category} weakness from ${group.length} observation(s).`,
          detectedAt: new Date().toISOString()
        };

        this.patterns.set(pattern.id, pattern);
        detected.push(pattern);
      }
    }

    return {
      observations: observations.length,
      patternsDetected: detected.length,
      patterns: detected
    };
  }

  recommend(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const analysis = this.analyze(input);
    const recommendations: LivingKernelRecommendation[] = [];

    for (const pattern of analysis.patterns) {
      const recommendation: LivingKernelRecommendation = {
        id: `living-kernel-recommendation:${Date.now()}:${
          this.recommendations.size + 1
        }`,
        title: `Improve ${pattern.category}`,
        description:
          `Address the detected ${pattern.category} weakness while preserving architectural governance.`,
        priority:
          pattern.impact === "critical"
            ? "critical"
            : pattern.impact === "high"
              ? "high"
              : pattern.impact === "medium"
                ? "medium"
                : "low",
        sourcePatternIds: [pattern.id],
        proposedActions: [
          `Review ${pattern.category} evidence`,
          `Prepare controlled improvement plan`,
          `Validate compatibility and rollback`,
          `Request human approval before implementation`
        ],
        requiresHumanApproval: true,
        status: "proposed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.recommendations.set(recommendation.id, recommendation);
      recommendations.push(recommendation);
    }

    return {
      total: recommendations.length,
      recommendations
    };
  }

  approve(input: {
    recommendationId: string;
    approvedByIdentityId: string;
    approve: boolean;
    correlationId: string;
  }) {
    const current = this.recommendations.get(input.recommendationId);

    if (!current) {
      throw new Error(
        `Living Kernel recommendation not found: ${input.recommendationId}`
      );
    }

    const updated: LivingKernelRecommendation = {
      ...current,
      approvedByIdentityId: input.approve
        ? input.approvedByIdentityId
        : undefined,
      status: input.approve ? "approved" : "rejected",
      updatedAt: new Date().toISOString()
    };

    this.recommendations.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "living-kernel",
      action: input.approve
        ? "living-kernel-recommendation-approved"
        : "living-kernel-recommendation-rejected",
      subjectId: updated.id,
      actorIdentityId: input.approvedByIdentityId,
      outcome: input.approve ? "success" : "blocked",
      metadata: {
        priority: updated.priority
      }
    });

    return updated;
  }

  listObservations() {
    return Array.from(this.observations.values());
  }

  listPatterns() {
    return Array.from(this.patterns.values());
  }

  listRecommendations() {
    return Array.from(this.recommendations.values());
  }

  summary() {
    const recommendations = this.listRecommendations();

    return {
      observations: this.observations.size,
      patterns: this.patterns.size,
      recommendations: recommendations.length,
      approvedRecommendations:
        recommendations.filter((x) => x.status === "approved").length,
      implementedRecommendations:
        recommendations.filter((x) => x.status === "implemented").length
    };
  }
}
