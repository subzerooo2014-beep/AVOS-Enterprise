import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  STRATEGIC_FOUNDATION_CAPABILITIES,
  STRATEGIC_INDUSTRY_REGISTRY,
  STRATEGIC_PLATFORM_REGISTRY,
} from "./strategic-foundation.registry";
import {
  ExecutiveStrategicBrief,
  FutureDevelopmentEvaluation,
  FutureDevelopmentProposal,
  StrategicAuditRecord,
} from "./strategic-foundation.types";

@Injectable()
export class StrategicFoundationService {
  private readonly evaluations =
    new Map<string, FutureDevelopmentEvaluation>();
  private readonly briefs =
    new Map<string, ExecutiveStrategicBrief>();
  private readonly audits =
    new Map<string, StrategicAuditRecord>();

  registry() {
    return {
      platforms: [...STRATEGIC_PLATFORM_REGISTRY],
      industries: [...STRATEGIC_INDUSTRY_REGISTRY],
      capabilities: STRATEGIC_FOUNDATION_CAPABILITIES.map(
        (capability) => ({
          ...capability,
          constitutionalAlignment: [
            ...capability.constitutionalAlignment,
          ],
        }),
      ),
      generatedAt: new Date().toISOString(),
    };
  }

  evaluateProposal(
    proposal: FutureDevelopmentProposal,
  ): FutureDevelopmentEvaluation {
    let score = 100;
    const reasons: string[] = [];
    const requiredActions: string[] = [];
    let decision: FutureDevelopmentEvaluation["decision"] = "APPROVE";
    let humanFinalDecisionRequired = false;

    if (proposal.constitutionalAlignment.length === 0) {
      score -= 40;
      decision = "REJECT";
      reasons.push("No alignment with the five AVOS constitutions.");
    } else {
      reasons.push("Constitutional alignment is declared.");
    }

    if (!proposal.reusableAcrossIndustries) {
      score -= 20;
      decision = decision === "REJECT" ? decision : "REDESIGN";
      requiredActions.push(
        "Redesign the capability for cross-industry reuse where possible.",
      );
    } else {
      reasons.push("Capability is reusable across industries.");
    }

    if (!proposal.buildsOnExistingFoundation) {
      score -= 30;
      decision = "REJECT";
      requiredActions.push(
        "Rebuild the proposal on the current AVOS foundation.",
      );
    } else {
      reasons.push("Proposal builds on the existing foundation.");
    }

    if (proposal.introducesDuplicateCapability) {
      score -= 35;
      decision = "REJECT";
      requiredActions.push(
        "Remove duplicate capability and extend the existing implementation.",
      );
    }

    if (proposal.increasesUncontrolledComplexity) {
      score -= 20;
      decision = decision === "REJECT" ? decision : "DEFER";
      requiredActions.push(
        "Reduce complexity and split optional features from the core.",
      );
    }

    if (
      proposal.targetIndustries.length === 0 ||
      proposal.targetIndustries.length === 1
    ) {
      score -= 10;
      requiredActions.push(
        "Document why the capability cannot serve multiple industries.",
      );
    }

    if (
      proposal.context?.["sensitiveExecutiveDecision"] === true ||
      proposal.context?.["highFinancialImpact"] === true ||
      proposal.context?.["highTrustImpact"] === true
    ) {
      humanFinalDecisionRequired = true;

      if (decision === "APPROVE") {
        decision = "REQUIRE_HUMAN_APPROVAL";
      }

      reasons.push(
        "Human final decision is required for protected impact.",
      );
    }

    const result: FutureDevelopmentEvaluation = {
      id: randomUUID(),
      proposalKey: proposal.key,
      decision,
      score: Math.max(0, score),
      reasons:
        reasons.length > 0
          ? reasons
          : ["Proposal satisfies strategic foundation rules."],
      requiredActions,
      humanFinalDecisionRequired,
      createdAt: new Date().toISOString(),
    };

    this.evaluations.set(result.id, result);
    return this.cloneEvaluation(result);
  }

  executiveBrief(
    tenantId: string,
    objective: string,
  ): ExecutiveStrategicBrief {
    const activeCapabilities =
      STRATEGIC_FOUNDATION_CAPABILITIES.filter(
        (capability) => capability.status === "ACTIVE",
      );

    const domainCount = (domain: string) =>
      activeCapabilities.filter(
        (capability) => capability.domain === domain,
      ).length;

    const readiness = (count: number) =>
      Math.min(100, 60 + count * 8);

    const brief: ExecutiveStrategicBrief = {
      id: randomUUID(),
      tenantId,
      objective,
      platformReadiness: readiness(
        domainCount("CORE_PLATFORM") + domainCount("BUSINESS"),
      ),
      growthReadiness: readiness(domainCount("GROWTH")),
      trustReadiness: readiness(domainCount("TRUST")),
      governanceReadiness: readiness(
        domainCount("GOVERNANCE") + domainCount("EXECUTIVE"),
      ),
      recommendations: [
        "Reuse current foundations before introducing new modules.",
        "Prioritize capabilities with multi-industry value.",
        "Apply constitutional evaluation before execution.",
        "Keep human final authority for protected strategic decisions.",
        "Defer optional complexity until measurable business value exists.",
      ],
      humanFinalDecisionRequired: true,
      createdAt: new Date().toISOString(),
    };

    this.briefs.set(brief.id, brief);

    return {
      ...brief,
      recommendations: [...brief.recommendations],
    };
  }

  trackAudit(
    input: Omit<StrategicAuditRecord, "id" | "createdAt">,
  ): StrategicAuditRecord {
    const audit: StrategicAuditRecord = {
      ...input,
      id: randomUUID(),
      payload: { ...input.payload },
      createdAt: new Date().toISOString(),
    };

    this.audits.set(audit.id, audit);

    return {
      ...audit,
      payload: { ...audit.payload },
    };
  }

  dashboard() {
    const evaluations = Array.from(this.evaluations.values());

    return {
      system: "AVOS Strategic Foundation Execution",
      platforms: STRATEGIC_PLATFORM_REGISTRY.length,
      industries: STRATEGIC_INDUSTRY_REGISTRY.length,
      capabilities: STRATEGIC_FOUNDATION_CAPABILITIES.length,
      evaluations: evaluations.length,
      approved: evaluations.filter(
        (evaluation) => evaluation.decision === "APPROVE",
      ).length,
      rejected: evaluations.filter(
        (evaluation) => evaluation.decision === "REJECT",
      ).length,
      redesignRequired: evaluations.filter(
        (evaluation) => evaluation.decision === "REDESIGN",
      ).length,
      deferred: evaluations.filter(
        (evaluation) => evaluation.decision === "DEFER",
      ).length,
      humanApprovalRequired: evaluations.filter(
        (evaluation) =>
          evaluation.decision === "REQUIRE_HUMAN_APPROVAL",
      ).length,
      executiveBriefs: this.briefs.size,
      audits: this.audits.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private cloneEvaluation(
    result: FutureDevelopmentEvaluation,
  ): FutureDevelopmentEvaluation {
    return {
      ...result,
      reasons: [...result.reasons],
      requiredActions: [...result.requiredActions],
    };
  }
}