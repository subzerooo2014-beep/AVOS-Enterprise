import {
  BlueprintRequirementProvider,
  BlueprintVersionProvider,
  EvolutionBlueprintCompatibilityEngine,
} from "./compatibility-engine";
import {
  EvolutionAuditLedger,
} from "./audit-ledger";
import {
  EvolutionExecutionPlanBuilder,
} from "./plan-builder";
import {
  EvolutionPolicyEngine,
} from "./policy-engine";
import {
  EvolutionProposalRegistry,
} from "./proposal-registry";
import {
  EvolutionRiskEngine,
} from "./risk-engine";
import {
  EvolutionGovernanceResult,
  EvolutionProposal,
  EvolutionProposalStatus,
} from "./contracts";

export class EvolutionGovernanceOrchestrator {
  readonly registry =
    new EvolutionProposalRegistry();

  readonly risk =
    new EvolutionRiskEngine();

  readonly policy =
    new EvolutionPolicyEngine();

  readonly audit =
    new EvolutionAuditLedger();

  readonly plans =
    new EvolutionExecutionPlanBuilder();

  readonly compatibility:
    EvolutionBlueprintCompatibilityEngine;

  constructor(
    versions:
      BlueprintVersionProvider,
    requirements:
      BlueprintRequirementProvider,
  ) {
    this.compatibility =
      new EvolutionBlueprintCompatibilityEngine(
        versions,
        requirements,
      );
  }

  govern(
    proposalInput: Omit<
      EvolutionProposal,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
    actor = "AVOS Evolution Center",
  ): EvolutionGovernanceResult {
    const proposal =
      this.registry.create(
        proposalInput,
      );

    this.audit.append({
      proposalId: proposal.id,
      action: "proposal.created",
      actor,
      message:
        "Evolution proposal created.",
    });

    this.registry.transition(
      proposal.id,
      EvolutionProposalStatus.SUBMITTED,
    );

    this.registry.transition(
      proposal.id,
      EvolutionProposalStatus.ANALYZING,
    );

    const analyzedProposal =
      this.registry.get(
        proposal.id,
      );

    const risk =
      this.risk.assess(
        analyzedProposal,
      );

    this.audit.append({
      proposalId: proposal.id,
      action: "risk.assessed",
      actor,
      message:
        `Risk assessed as ${risk.level} with score ${risk.score}.`,
      metadata: {
        score: risk.score,
        level: risk.level,
      },
    });

    const compatibility =
      this.compatibility.evaluate(
        analyzedProposal,
      );

    this.audit.append({
      proposalId: proposal.id,
      action:
        "compatibility.evaluated",
      actor,
      message:
        compatibility.compatible
          ? "Blueprint compatibility passed."
          : "Blueprint compatibility failed.",
      metadata: {
        compatible:
          compatibility.compatible,
        findings:
          compatibility.findings.length,
      },
    });

    const decision =
      this.policy.evaluate({
        proposal:
          analyzedProposal,
        risk,
        compatibility,
      });

    const finalStatus =
      decision.approved
        ? EvolutionProposalStatus.APPROVED
        : EvolutionProposalStatus.REJECTED;

    const finalProposal =
      this.registry.transition(
        proposal.id,
        finalStatus,
      );

    this.audit.append({
      proposalId: proposal.id,
      action: "policy.decided",
      actor,
      message:
        `Evolution decision: ${decision.decision}.`,
      metadata: {
        approved:
          decision.approved,
        controls:
          decision.controls.length,
      },
    });

    const plan =
      decision.approved
        ? this.plans.build(
            finalProposal,
            decision,
          )
        : undefined;

    if (plan) {
      this.audit.append({
        proposalId: proposal.id,
        action: "plan.generated",
        actor,
        message:
          `Execution plan generated with ${plan.steps.length} steps.`,
      });
    }

    return {
      success:
        decision.approved,
      proposal:
        finalProposal,
      risk,
      compatibility,
      decision,
      ...(plan ? { plan } : {}),
      auditEntries:
        this.audit.list(
          proposal.id,
        ),
      completedAt:
        new Date().toISOString(),
    };
  }
}
