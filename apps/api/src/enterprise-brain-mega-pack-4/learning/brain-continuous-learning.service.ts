import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainLearningRecord } from "../enterprise-brain-mega-pack-4.types";
import { BrainPatternLearningService } from "../patterns/brain-pattern-learning.service";
import { BrainFeedbackService } from "../feedback/brain-feedback.service";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainContinuousLearningService {
  private readonly records = new Map<string, BrainLearningRecord>();

  constructor(
    private readonly patterns: BrainPatternLearningService,
    private readonly feedback: BrainFeedbackService,
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Brain learning record not found: ${id}`);
    }

    return record;
  }

  propose(input: {
    title: string;
    description: string;
    sourcePatternIds: string[];
    sourceFeedbackIds: string[];
    confidence: number;
    proposedChanges: string[];
    requiresHumanApproval: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    for (const patternId of input.sourcePatternIds) {
      const exists = this.patterns.list().some((x) => x.id === patternId);

      if (!exists) {
        throw new ConflictException(`Brain pattern not found: ${patternId}`);
      }
    }

    for (const feedbackId of input.sourceFeedbackIds) {
      const exists = this.feedback.list().some((x) => x.id === feedbackId);

      if (!exists) {
        throw new ConflictException(`Brain feedback not found: ${feedbackId}`);
      }
    }

    const now = new Date().toISOString();

    const record: BrainLearningRecord = {
      id: `brain-learning:${Date.now()}:${this.records.size + 1}`,
      title: input.title,
      description: input.description,
      sourcePatternIds: Array.from(new Set(input.sourcePatternIds)),
      sourceFeedbackIds: Array.from(new Set(input.sourceFeedbackIds)),
      status: "observed",
      confidence: Math.max(0, Math.min(100, input.confidence)),
      proposedChanges: Array.from(new Set(input.proposedChanges)),
      requiresHumanApproval: input.requiresHumanApproval,
      createdAt: now,
      updatedAt: now
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "learning",
      action: "brain-learning-proposed",
      subjectId: record.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        record.requiresHumanApproval
          ? "warning"
          : "success",
      metadata: {
        confidence: record.confidence,
        proposedChanges: record.proposedChanges.length
      }
    });

    return record;
  }

  approve(input: {
    learningId: string;
    approvedByIdentityId: string;
    approve: boolean;
    correlationId: string;
  }) {
    const current = this.get(input.learningId);

    const updated: BrainLearningRecord = {
      ...current,
      status: input.approve ? "validated" : "rejected",
      approvedByIdentityId:
        input.approve
          ? input.approvedByIdentityId
          : undefined,
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  apply(input: {
    learningId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.learningId);

    if (
      current.requiresHumanApproval &&
      !current.approvedByIdentityId
    ) {
      throw new ConflictException(
        "Brain learning application requires human approval."
      );
    }

    const updated: BrainLearningRecord = {
      ...current,
      status: "applied",
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      observed: items.filter((x) => x.status === "observed").length,
      validated: items.filter((x) => x.status === "validated").length,
      applied: items.filter((x) => x.status === "applied").length,
      rejected: items.filter((x) => x.status === "rejected").length
    };
  }
}
