import { Injectable, NotFoundException } from "@nestjs/common";
import {
  DecisionActorType,
  DecisionRecord,
  DecisionStatus,
  ExplainabilityFactor
} from "../foundation-pack-7.types";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";
import { DataProvenanceGraphService } from "../provenance/data-provenance-graph.service";

@Injectable()
export class DecisionRegistryService {
  private readonly decisions = new Map<string, DecisionRecord>();

  constructor(
    private readonly audit: TrustAuditLedgerService,
    private readonly provenance: DataProvenanceGraphService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  get(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(`Decision not found: ${id}`);
    }

    return decision;
  }

  create(input: {
    decisionType: string;
    title: string;
    description: string;
    subjectId: string;
    correlationId: string;
    causationId?: string;
    actorId: string;
    actorType: DecisionActorType;
    requestedAction: string;
    alternatives?: string[];
    rationale?: string;
    confidence?: number;
    riskScore?: number;
    policyIds?: string[];
    evidenceIds?: string[];
    provenanceNodeIds?: string[];
    explainabilityFactors?: ExplainabilityFactor[];
    requiresHumanApproval?: boolean;
    metadata?: Record<string, unknown>;
  }) {
    const now = new Date().toISOString();
    const decision: DecisionRecord = {
      id: `decision:${Date.now()}:${this.decisions.size + 1}`,
      decisionType: input.decisionType,
      title: input.title,
      description: input.description,
      subjectId: input.subjectId,
      correlationId: input.correlationId,
      causationId: input.causationId,
      actorId: input.actorId,
      actorType: input.actorType,
      status: "proposed",
      requestedAction: input.requestedAction,
      alternatives: input.alternatives ?? [],
      rationale: input.rationale ?? "",
      confidence: this.clamp(input.confidence ?? 0),
      riskScore: this.clamp(input.riskScore ?? 0),
      policyIds: Array.from(new Set(input.policyIds ?? [])),
      evidenceIds: Array.from(new Set(input.evidenceIds ?? [])),
      provenanceNodeIds: Array.from(
        new Set(input.provenanceNodeIds ?? [])
      ),
      explainabilityFactors: input.explainabilityFactors ?? [],
      requiresHumanApproval: input.requiresHumanApproval ?? false,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    this.decisions.set(decision.id, decision);

    const node = this.provenance.createNode({
      id: `provenance:${decision.id}`,
      type: "decision",
      label: decision.title,
      sourceSystem: "AVOS Trust Framework",
      ownerIdentityId: decision.actorId,
      metadata: {
        decisionId: decision.id,
        decisionType: decision.decisionType
      },
      correlationId: decision.correlationId,
      actorIdentityId: decision.actorId
    });

    this.decisions.set(decision.id, {
      ...decision,
      provenanceNodeIds: Array.from(
        new Set([...decision.provenanceNodeIds, node.id])
      )
    });

    this.audit.record({
      correlationId: decision.correlationId,
      category: "decision",
      action: "decision-created",
      subjectId: decision.id,
      actorIdentityId: decision.actorId,
      outcome: "success",
      after: {
        status: decision.status,
        decisionType: decision.decisionType,
        requestedAction: decision.requestedAction,
        riskScore: decision.riskScore
      },
      metadata: {}
    });

    return this.get(decision.id);
  }

  update(
    id: string,
    patch: {
      status?: DecisionStatus;
      selectedOption?: string;
      rationale?: string;
      confidence?: number;
      riskScore?: number;
      trustScore?: number;
      requiresHumanApproval?: boolean;
      humanApprovalId?: string;
      evidenceIds?: string[];
      provenanceNodeIds?: string[];
      explainabilityFactors?: ExplainabilityFactor[];
      metadata?: Record<string, unknown>;
    },
    context: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    const current = this.get(id);
    const now = new Date().toISOString();
    const nextStatus = patch.status ?? current.status;

    const updated: DecisionRecord = {
      ...current,
      ...patch,
      confidence:
        patch.confidence === undefined
          ? current.confidence
          : this.clamp(patch.confidence),
      riskScore:
        patch.riskScore === undefined
          ? current.riskScore
          : this.clamp(patch.riskScore),
      trustScore:
        patch.trustScore === undefined
          ? current.trustScore
          : this.clamp(patch.trustScore),
      evidenceIds:
        patch.evidenceIds === undefined
          ? current.evidenceIds
          : Array.from(new Set(patch.evidenceIds)),
      provenanceNodeIds:
        patch.provenanceNodeIds === undefined
          ? current.provenanceNodeIds
          : Array.from(new Set(patch.provenanceNodeIds)),
      explainabilityFactors:
        patch.explainabilityFactors ??
        current.explainabilityFactors,
      metadata: {
        ...current.metadata,
        ...(patch.metadata ?? {})
      },
      updatedAt: now,
      decidedAt:
        ["approved", "rejected"].includes(nextStatus)
          ? current.decidedAt ?? now
          : current.decidedAt,
      executedAt:
        nextStatus === "executed"
          ? current.executedAt ?? now
          : current.executedAt
    };

    this.decisions.set(id, updated);

    this.audit.record({
      correlationId: context.correlationId,
      category: "decision",
      action: `decision-status:${updated.status}`,
      subjectId: updated.id,
      actorIdentityId: context.actorIdentityId,
      outcome:
        updated.status === "rejected" ||
        updated.status === "failed"
          ? "blocked"
          : "success",
      before: {
        status: current.status,
        trustScore: current.trustScore
      },
      after: {
        status: updated.status,
        trustScore: updated.trustScore
      },
      metadata: {}
    });

    return updated;
  }

  byCorrelation(correlationId: string) {
    return this.list().filter(
      (decision) => decision.correlationId === correlationId
    );
  }

  summary() {
    const decisions = this.list();

    return {
      total: decisions.length,
      proposed: decisions.filter(
        (decision) => decision.status === "proposed"
      ).length,
      approved: decisions.filter(
        (decision) => decision.status === "approved"
      ).length,
      rejected: decisions.filter(
        (decision) => decision.status === "rejected"
      ).length,
      executed: decisions.filter(
        (decision) => decision.status === "executed"
      ).length,
      humanApprovalRequired: decisions.filter(
        (decision) => decision.requiresHumanApproval
      ).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, Number(value.toFixed(2))));
  }
}
