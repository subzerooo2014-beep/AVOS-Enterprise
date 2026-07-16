import { Injectable } from "@nestjs/common";
import { BrainExplanation } from "../enterprise-brain-mega-pack-6.types";
import { BrainEvidenceVaultService } from "../evidence/brain-evidence-vault.service";
import { BrainDecisionTraceabilityService } from "../traceability/brain-decision-traceability.service";
import { BrainTrustAuditService } from "../observability/brain-trust-audit.service";

@Injectable()
export class BrainExplainabilityService {
  private readonly records = new Map<string, BrainExplanation>();

  constructor(
    private readonly evidence: BrainEvidenceVaultService,
    private readonly traces: BrainDecisionTraceabilityService,
    private readonly audit: BrainTrustAuditService
  ) {}

  list() {
    return Array.from(this.records.values());
  }

  get(id: string) {
    const record = this.records.get(id);

    if (!record) {
      throw new Error(`Brain explanation not found: ${id}`);
    }

    return record;
  }

  generate(input: {
    subjectId: string;
    type: BrainExplanation["type"];
    summary: string;
    rationale: string[];
    evidenceIds: string[];
    assumptions?: string[];
    alternatives?: string[];
    limitations?: string[];
    confidence: number;
    riskScore: number;
    modelOrEngine: string;
    generatedByIdentityId: string;
    correlationId: string;
  }) {
    for (const evidenceId of input.evidenceIds) {
      this.evidence.get(evidenceId);
    }

    const record: BrainExplanation = {
      id: `brain-explanation:${Date.now()}:${this.records.size + 1}`,
      subjectId: input.subjectId,
      type: input.type,
      summary: input.summary,
      rationale: Array.from(new Set(input.rationale)),
      evidenceIds: Array.from(new Set(input.evidenceIds)),
      assumptions: Array.from(new Set(input.assumptions ?? [])),
      alternatives: Array.from(new Set(input.alternatives ?? [])),
      limitations: Array.from(new Set(input.limitations ?? [])),
      confidence: Math.max(0, Math.min(100, input.confidence)),
      riskScore: Math.max(0, Math.min(100, input.riskScore)),
      modelOrEngine: input.modelOrEngine,
      generatedByIdentityId: input.generatedByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.records.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "explainability",
      action: "brain-explanation-generated",
      subjectId: record.id,
      actorIdentityId: input.generatedByIdentityId,
      outcome:
        record.confidence >= 70
          ? "success"
          : "warning",
      metadata: {
        type: record.type,
        confidence: record.confidence,
        riskScore: record.riskScore
      }
    });

    return record;
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      decision: items.filter((x) => x.type === "decision").length,
      reasoning: items.filter((x) => x.type === "reasoning").length,
      prediction: items.filter((x) => x.type === "prediction").length,
      averageConfidence:
        items.length === 0
          ? 0
          : Number(
              (
                items.reduce((sum, item) => sum + item.confidence, 0) /
                items.length
              ).toFixed(2)
            )
    };
  }
}
