import { Injectable } from "@nestjs/common";
import { BrainFeedbackRecord } from "../enterprise-brain-mega-pack-4.types";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainFeedbackService {
  private readonly records = new Map<string, BrainFeedbackRecord>();

  constructor(
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  add(input: {
    type: BrainFeedbackRecord["type"];
    sourceIdentityId?: string;
    subjectId: string;
    rating: number;
    message: string;
    labels?: string[];
    metadata?: Record<string, unknown>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const record: BrainFeedbackRecord = {
      id: `brain-feedback:${Date.now()}:${this.records.size + 1}`,
      type: input.type,
      sourceIdentityId: input.sourceIdentityId,
      subjectId: input.subjectId,
      rating: Math.max(0, Math.min(100, input.rating)),
      message: input.message,
      labels: Array.from(new Set(input.labels ?? [])),
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "feedback",
      action: "brain-feedback-recorded",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        record.rating >= 70
          ? "success"
          : record.rating >= 40
            ? "warning"
            : "failure",
      metadata: {
        type: record.type,
        rating: record.rating
      }
    });

    return record;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      positive: items.filter((x) => x.rating >= 70).length,
      neutral: items.filter((x) => x.rating >= 40 && x.rating < 70).length,
      negative: items.filter((x) => x.rating < 40).length,
      averageRating:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, x) => sum + x.rating, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
