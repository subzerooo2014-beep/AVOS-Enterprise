import { Injectable } from "@nestjs/common";
import { BrainExperienceRecord } from "../enterprise-brain-mega-pack-4.types";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainExperienceService {
  private readonly records = new Map<string, BrainExperienceRecord>();

  constructor(
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(input: {
    sourceType: string;
    sourceId: string;
    context: Record<string, unknown>;
    actions: string[];
    outcome: BrainExperienceRecord["outcome"];
    score: number;
    lessons: string[];
    evidenceIds?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record: BrainExperienceRecord = {
      id: `brain-experience:${Date.now()}:${this.records.size + 1}`,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      context: input.context,
      actions: Array.from(new Set(input.actions)),
      outcome: input.outcome,
      score: Math.max(0, Math.min(100, input.score)),
      lessons: Array.from(new Set(input.lessons)),
      evidenceIds: Array.from(new Set(input.evidenceIds ?? [])),
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "experience",
      action: "brain-experience-recorded",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        record.outcome === "success"
          ? "success"
          : record.outcome === "partial"
            ? "warning"
            : "failure",
      metadata: {
        sourceType: record.sourceType,
        score: record.score
      }
    });

    return record;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      success: items.filter((x) => x.outcome === "success").length,
      partial: items.filter((x) => x.outcome === "partial").length,
      failure: items.filter((x) => x.outcome === "failure").length,
      averageScore:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, x) => sum + x.score, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
