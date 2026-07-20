import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { AdaptiveGrowthActionService } from "../execution-core/adaptive-growth-action.service";
import {
  AgsDecisionRecord,
  AgsHumanDecisionInput,
} from "./adaptive-growth-approval.contracts";
import { AdaptiveGrowthApprovalPolicyService } from "./adaptive-growth-approval-policy.service";
import { AdaptiveGrowthApprovalStoreService } from "./adaptive-growth-approval-store.service";
import { AdaptiveGrowthDecisionAuditService } from "./adaptive-growth-decision-audit.service";
import { AdaptiveGrowthDecisionSignatureService } from "./adaptive-growth-decision-signature.service";
import { AdaptiveGrowthGovernanceIdService } from "./adaptive-growth-governance-id.service";
import { AdaptiveGrowthHumanFinalAuthorityService } from "./adaptive-growth-human-final-authority.service";

@Injectable()
export class AdaptiveGrowthHumanDecisionService {
  constructor(
    private readonly actions:
      AdaptiveGrowthActionService,
    private readonly policies:
      AdaptiveGrowthApprovalPolicyService,
    private readonly authority:
      AdaptiveGrowthHumanFinalAuthorityService,
    private readonly signatures:
      AdaptiveGrowthDecisionSignatureService,
    private readonly audit:
      AdaptiveGrowthDecisionAuditService,
    private readonly ids:
      AdaptiveGrowthGovernanceIdService,
    private readonly store:
      AdaptiveGrowthApprovalStoreService,
  ) {}

  decide(
    input: AgsHumanDecisionInput,
  ): AgsDecisionRecord {
    const approval =
      this.store.getApproval(
        input.approvalId,
      );

    if (
      [
        "approved",
        "rejected",
        "expired",
      ].includes(approval.status)
    ) {
      throw new BadRequestException(
        `Approval is already finalized with status ${approval.status}.`,
      );
    }

    const policy = this.policies.resolve(
      approval.riskLevel,
    );

    this.authority.assertAuthority({
      approverId: input.approverId,
      providedAuthority:
        input.authority,
      requiredAuthority:
        policy.requiredAuthority,
    });

    if (
      policy.requiresReason &&
      !input.reason?.trim()
    ) {
      throw new BadRequestException(
        "Decision reason is required.",
      );
    }

    const evidenceIds = [
      ...new Set([
        ...approval.evidenceIds,
        ...(input.evidenceIds ?? []),
      ]),
    ];

    if (
      input.decision === "approve" &&
      evidenceIds.length <
        policy.minimumEvidenceItems
    ) {
      throw new BadRequestException({
        message:
          "Insufficient evidence for approval.",
        minimumEvidenceItems:
          policy.minimumEvidenceItems,
        availableEvidenceItems:
          evidenceIds.length,
      });
    }

    const createdAt =
      new Date().toISOString();

    const unsigned = {
      approvalId: approval.id,
      actionId: approval.actionId,
      decision: input.decision,
      approverId: input.approverId,
      authority: input.authority,
      reason: input.reason,
      notes: input.notes,
      riskLevel: approval.riskLevel,
      policyKey: approval.policyKey,
      evidenceIds,
      version: "AGS-MP2B-1.0.0",
      createdAt,
    };

    const signed =
      this.signatures.sign(unsigned);

    const decision: AgsDecisionRecord = {
      id: this.ids.create(
        "ags-human-decision",
      ),
      ...unsigned,
      ...signed,
    };

    this.store.saveDecision(decision);

    const nextApprovalStatus =
      input.decision === "approve"
        ? "approved"
        : input.decision === "reject"
          ? "rejected"
          : input.decision === "return"
            ? "returned"
            : "waiting-evidence";

    this.store.saveApproval({
      ...approval,
      status: nextApprovalStatus,
      assignedTo:
        input.approverId,
      evidenceIds,
      updatedAt: createdAt,
    });

    if (input.decision === "approve") {
      this.actions.transition(
        approval.actionId,
        "approved",
        input.approverId,
        input.reason,
      );
    }

    if (input.decision === "reject") {
      this.actions.transition(
        approval.actionId,
        "cancelled",
        input.approverId,
        input.reason,
      );
    }

    this.audit.record({
      decisionId: decision.id,
      approvalId: approval.id,
      actionId: approval.actionId,
      event:
        `decision-${input.decision}`,
      actor: input.approverId,
      details: {
        authority: input.authority,
        policyKey: approval.policyKey,
        evidenceIds,
        decisionHash:
          decision.decisionHash,
        signature:
          decision.signature,
        humanFinalAuthority: true,
      },
    });

    return decision;
  }

  get(id: string) {
    return this.store.getDecision(id);
  }

  list() {
    return this.store.listDecisions();
  }

  verify(id: string) {
    const decision =
      this.store.getDecision(id);

    const payload = {
      approvalId: decision.approvalId,
      actionId: decision.actionId,
      decision: decision.decision,
      approverId: decision.approverId,
      authority: decision.authority,
      reason: decision.reason,
      notes: decision.notes,
      riskLevel: decision.riskLevel,
      policyKey: decision.policyKey,
      evidenceIds: decision.evidenceIds,
      version: decision.version,
      createdAt: decision.createdAt,
    };

    return {
      decisionId: decision.id,
      valid: this.signatures.verify(
        payload,
        decision.decisionHash,
        decision.signature,
      ),
      algorithm:
        decision.signatureAlgorithm,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}