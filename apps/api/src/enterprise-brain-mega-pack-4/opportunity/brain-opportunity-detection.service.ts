import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { BrainOpportunity } from "../enterprise-brain-mega-pack-4.types";
import { BrainLearningAuditService } from "../observability/brain-learning-audit.service";

@Injectable()
export class BrainOpportunityDetectionService {
  private readonly records = new Map<string, BrainOpportunity>();

  constructor(
    private readonly audit: BrainLearningAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new NotFoundException(`Brain opportunity not found: ${id}`);
    }

    return record;
  }

  detect(input: {
    subjectId: string;
    title: string;
    description: string;
    valueScore: number;
    feasibilityScore: number;
    urgencyScore: number;
    confidence: number;
    requirements?: string[];
    risks?: string[];
    actorIdentityId: string;
    correlationId: string;
  }) {
    const now = new Date().toISOString();

    const opportunity: BrainOpportunity = {
      id: `brain-opportunity:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      title: input.title,
      description: input.description,
      valueScore: Math.max(0, Math.min(100, input.valueScore)),
      feasibilityScore: Math.max(0, Math.min(100, input.feasibilityScore)),
      urgencyScore: Math.max(0, Math.min(100, input.urgencyScore)),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      requirements: Array.from(new Set(input.requirements ?? [])),
      risks: Array.from(new Set(input.risks ?? [])),
      status: "detected",
      createdAt: now,
      updatedAt: now
    };

    this.records.set(opportunity.id, opportunity);

    return opportunity;
  }

  decide(input: {
    opportunityId: string;
    identityId: string;
    approve: boolean;
    correlationId: string;
  }) {
    const current = this.get(input.opportunityId);

    const updated: BrainOpportunity = {
      ...current,
      status: input.approve ? "approved" : "rejected",
      approvedByIdentityId:
        input.approve
          ? input.identityId
          : undefined,
      updatedAt: new Date().toISOString()
    };

    this.records.set(updated.id, updated);

    this.audit.record({
      correlationId: input.correlationId,
      category: "opportunity",
      action:
        input.approve
          ? "brain-opportunity-approved"
          : "brain-opportunity-rejected",
      subjectId: updated.id,
      actorIdentityId: input.identityId,
      outcome: input.approve ? "success" : "blocked",
      metadata: {
        valueScore: updated.valueScore,
        feasibilityScore: updated.feasibilityScore
      }
    });

    return updated;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      approved: items.filter((x) => x.status === "approved").length,
      rejected: items.filter((x) => x.status === "rejected").length,
      highValue:
        items.filter((x) => x.valueScore >= 75).length
    };
  }
}
