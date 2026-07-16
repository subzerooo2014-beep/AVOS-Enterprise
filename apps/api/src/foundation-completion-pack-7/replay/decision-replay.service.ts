import { Injectable } from "@nestjs/common";
import { DecisionReplayResult } from "../foundation-pack-7.types";
import { DecisionRegistryService } from "../decisions/decision-registry.service";
import { DecisionTraceGraphService } from "../decisions/decision-trace-graph.service";
import { TrustScoreEngineService } from "../trust/trust-score-engine.service";
import { TrustAuditLedgerService } from "../audit/trust-audit-ledger.service";

@Injectable()
export class DecisionReplayService {
  private readonly replays =
    new Map<string, DecisionReplayResult>();

  constructor(
    private readonly decisions: DecisionRegistryService,
    private readonly traceGraph: DecisionTraceGraphService,
    private readonly trust: TrustScoreEngineService,
    private readonly audit: TrustAuditLedgerService
  ) {}

  list() {
    return Array.from(this.replays.values());
  }

  replay(input: {
    sourceDecisionId: string;
    replayedByIdentityId: string;
    correlationId: string;
    overrideMetadata?: Record<string, unknown>;
  }) {
    const source = this.decisions.get(input.sourceDecisionId);

    const replay = this.decisions.create({
      decisionType: source.decisionType,
      title: `Replay: ${source.title}`,
      description: source.description,
      subjectId: source.subjectId,
      correlationId: input.correlationId,
      causationId: source.id,
      actorId: input.replayedByIdentityId,
      actorType: "human",
      requestedAction: source.requestedAction,
      alternatives: source.alternatives,
      rationale: source.rationale,
      confidence: source.confidence,
      riskScore: source.riskScore,
      policyIds: source.policyIds,
      evidenceIds: source.evidenceIds,
      provenanceNodeIds: source.provenanceNodeIds,
      explainabilityFactors: source.explainabilityFactors,
      requiresHumanApproval: source.requiresHumanApproval,
      metadata: {
        ...source.metadata,
        ...(input.overrideMetadata ?? {}),
        replayOfDecisionId: source.id
      }
    });

    const equivalentInputs =
      JSON.stringify(source.evidenceIds) ===
        JSON.stringify(replay.evidenceIds) &&
      JSON.stringify(source.policyIds) ===
        JSON.stringify(replay.policyIds);

    const equivalentOutcome =
      source.selectedOption === replay.selectedOption &&
      source.requestedAction === replay.requestedAction;

    const differences: string[] = [];

    if (!equivalentInputs) {
      differences.push(
        "Evidence or policy inputs differ from the source decision."
      );
    }

    if (!equivalentOutcome) {
      differences.push(
        "Replay outcome differs from the source decision."
      );
    }

    const result: DecisionReplayResult = {
      id: `decision-replay:${Date.now()}:${this.replays.size + 1}`,
      sourceDecisionId: source.id,
      replayDecisionId: replay.id,
      correlationId: input.correlationId,
      equivalentInputs,
      equivalentOutcome,
      originalTrustScore: source.trustScore,
      replayTrustScore: replay.trustScore,
      differences,
      replayedByIdentityId: input.replayedByIdentityId,
      replayedAt: new Date().toISOString()
    };

    this.replays.set(result.id, result);

    this.traceGraph.link({
      fromDecisionId: source.id,
      toDecisionId: replay.id,
      relation: "replayed",
      reason: "Decision replay generated for traceable comparison.",
      correlationId: input.correlationId,
      actorIdentityId: input.replayedByIdentityId
    });

    this.audit.record({
      correlationId: input.correlationId,
      category: "replay",
      action: "decision-replayed",
      subjectId: result.id,
      actorIdentityId: input.replayedByIdentityId,
      outcome: "success",
      after: {
        sourceDecisionId: source.id,
        replayDecisionId: replay.id,
        equivalentInputs,
        equivalentOutcome
      },
      metadata: {
        differences
      }
    });

    return result;
  }

  reassessReplay(
    replayDecisionId: string,
    policyId: string,
    assessedByIdentityId: string
  ) {
    return this.trust.assessDecision({
      decisionId: replayDecisionId,
      policyId,
      assessedByIdentityId
    });
  }

  summary() {
    const replays = this.list();

    return {
      total: replays.length,
      equivalentInputs: replays.filter(
        (replay) => replay.equivalentInputs
      ).length,
      equivalentOutcome: replays.filter(
        (replay) => replay.equivalentOutcome
      ).length,
      differencesDetected: replays.filter(
        (replay) => replay.differences.length > 0
      ).length
    };
  }
}
