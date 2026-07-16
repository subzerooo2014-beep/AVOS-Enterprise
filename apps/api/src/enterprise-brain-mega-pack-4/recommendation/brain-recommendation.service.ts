import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainRecommendation } from "../enterprise-brain-mega-pack-4.types";
import { BrainPredictionService } from "../prediction/brain-prediction.service";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainRecommendationService {
  private readonly records = new Map<string, BrainRecommendation>();

  constructor(
    private readonly predictions: BrainPredictionService,
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Brain recommendation not found: ${id}`);
    }

    return record;
  }

  create(input: {
    subjectId: string;
    title: string;
    description: string;
    priority: BrainRecommendation["priority"];
    expectedValue: number;
    confidence: number;
    actions: string[];
    risks?: string[];
    requiresHumanApproval: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const recommendation: BrainRecommendation = {
      id: `brain-recommendation:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      expectedValue: Math.max(0, Math.min(100, input.expectedValue)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      actions: Array.from(new Set(input.actions)),
      risks: Array.from(new Set(input.risks ?? [])),
      requiresHumanApproval: input.requiresHumanApproval,
      status: "proposed",
      createdAt: now,
      updatedAt: now
    };

    this.records.set(recommendation.id, recommendation);

    return recommendation;
  }

  decide(input: {
    recommendationId: string;
    identityId: string;
    approve: boolean;
    correlationId: string;
  }) {
    const current = this.get(input.recommendationId);

    const updated: BrainRecommendation = {
      ...current,
      approvedByIdentityId:
        input.approve
          ? input.identityId
          : undefined,
      status: input.approve ? "approved" : "rejected",
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "recommendation",
      action:
        input.approve
          ? "brain-recommendation-approved"
          : "brain-recommendation-rejected",
      subjectId: updated.id,
      actorIdentityId: input.identityId,
      outcome: input.approve ? "success" : "blocked",
      metadata: {
        priority: updated.priority
      }
    });

    return updated;
  }

  implement(input: {
    recommendationId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.get(input.recommendationId);

    if (
      current.requiresHumanApproval &&
      !current.approvedByIdentityId
    ) {
      throw new ConflictException(
        "Brain recommendation implementation requires human approval."
      );
    }

    const updated: BrainRecommendation = {
      ...current,
      status: "implemented",
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);
    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      proposed: items.filter((x) => x.status === "proposed").length,
      approved: items.filter((x) => x.status === "approved").length,
      implemented: items.filter((x) => x.status === "implemented").length,
      rejected: items.filter((x) => x.status === "rejected").length
    };
  }
}
