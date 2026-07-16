import { Injectable } from "@nestjs/common";
import { BrainPatternRecord } from "../enterprise-brain-mega-pack-4.types";
import { BrainExperienceService } from "../experience/brain-experience.service";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainPatternLearningService {
  private readonly patterns = new Map<string, BrainPatternRecord>();

  constructor(
    private readonly experiences: BrainExperienceService,
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.patterns.values());
  }

  detect(input: {
    actorIdentityId: string;
    correlationId: string;
  }) {
    const groups = new Map<string, string[]>();

    for (const experience of this.experiences.list()) {
      const key = `${experience.sourceType}:${experience.outcome}`;
      const ids = groups.get(key) ?? [];
      ids.push(experience.id);
      groups.set(key, ids);
    }

    const detected: BrainPatternRecord[] = [];

    for (const [key, ids] of groups.entries()) {
      if (ids.length < 1) continue;

      const [category, outcome] = key.split(":");
      const confidence = Math.min(100, 60 + ids.length * 10);

      const pattern: BrainPatternRecord = {
        id: `brain-pattern:${Date.now()}:${this.patterns.size + 1}`,
        name: `${category}-${outcome}-pattern`,
        category: category ?? "general",
        sourceExperienceIds: ids,
        frequency: ids.length,
        confidence,
        impact:
          outcome === "failure"
            ? "high"
            : outcome === "partial"
              ? "medium"
              : "low",
        description:
          `Detected recurring ${outcome} pattern in ${category}.`,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.patterns.set(pattern.id, pattern);
      detected.push(pattern);
    }

    this.audit.record({
      correlationId: input.correlationId,
      category: "pattern",
      action: "brain-pattern-detection-completed",
      subjectId: "brain-pattern-detector",
      actorIdentityId: input.actorIdentityId,
      outcome: "success",
      metadata: {
        detected: detected.length
      }
    });

    return {
      detected: detected.length,
      patterns: detected
    };
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      active: items.filter((x) => x.active).length,
      highImpact:
        items.filter(
          (x) => x.impact === "high" || x.impact === "critical"
        ).length
    };
  }
}
