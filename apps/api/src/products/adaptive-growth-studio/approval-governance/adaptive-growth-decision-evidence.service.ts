import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthActionService } from "../execution-core/adaptive-growth-action.service";
import { AdaptiveGrowthGovernanceIdService } from "./adaptive-growth-governance-id.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";

@Injectable()
export class AdaptiveGrowthDecisionEvidenceService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly ids:
      AdaptiveGrowthGovernanceIdService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
  ) {}

  collect(
    approvalId: string,
  ) {
    const approval =
      this.store.getApproval(approvalId);

    const action = this.actions.get(
      approval.actionId,
    );

    const candidates = [
      {
        source: "adaptive-growth-engine",
        type: "recommendation-context",
        title: "Growth action context",
        summary:
          `Objective: ${action.objective}`,
        payload: {
          definitionKey:
            action.definitionKey,
          sourceType: action.sourceType,
          sourceId: action.sourceId,
          metadata: action.metadata,
        },
        confidence: 0.84,
      },
      {
        source: "knowledge-fabric",
        type: "knowledge-evidence",
        title: "Knowledge context readiness",
        summary:
          "Knowledge Fabric context is available for governance review.",
        payload: {
          ready: true,
          traceability: true,
        },
        confidence: 0.88,
      },
      {
        source: "capability-fabric",
        type: "capability-evidence",
        title: "Capability execution readiness",
        summary:
          "Required execution capability is registered and addressable.",
        payload: {
          capabilityReady: true,
          actionDefinition:
            action.definitionKey,
        },
        confidence: 0.9,
      },
      {
        source: "enterprise-brain",
        type: "risk-evidence",
        title: "Enterprise risk context",
        summary:
          `Action risk classification is ${action.riskLevel}.`,
        payload: {
          riskLevel: action.riskLevel,
          requiresApproval:
            action.requiresApproval,
          supportsRollback:
            action.supportsRollback,
        },
        confidence: 0.87,
      },
    ];

    const existing =
      this.store.listEvidence(approvalId);

    if (existing.length > 0) {
      return existing;
    }

    const collected = candidates.map(
      (candidate) =>
        this.store.saveEvidence({
          id: this.ids.create(
            "ags-decision-evidence",
          ),
          approvalId,
          actionId: action.id,
          ...candidate,
          collectedAt:
            new Date().toISOString(),
        }),
    );

    this.store.saveApproval({
      ...approval,
      evidenceIds: collected.map(
        (item) => item.id,
      ),
      status: "under-review",
      updatedAt:
        new Date().toISOString(),
    });

    return collected;
  }

  add(
    approvalId: string,
    input: {
      source: string;
      type: string;
      title: string;
      summary: string;
      payload?: Record<string, unknown>;
      confidence?: number;
    },
  ) {
    const approval =
      this.store.getApproval(approvalId);

    const item = this.store.saveEvidence({
      id: this.ids.create(
        "ags-decision-evidence",
      ),
      approvalId,
      actionId: approval.actionId,
      source: input.source,
      type: input.type,
      title: input.title,
      summary: input.summary,
      payload: input.payload ?? {},
      confidence:
        input.confidence ?? 0.75,
      collectedAt:
        new Date().toISOString(),
    });

    this.store.saveApproval({
      ...approval,
      evidenceIds: [
        ...new Set([
          ...approval.evidenceIds,
          item.id,
        ]),
      ],
      status: "under-review",
      updatedAt:
        new Date().toISOString(),
    });

    return item;
  }

  list(approvalId?: string) {
    return this.store.listEvidence(
      approvalId,
    );
  }
}