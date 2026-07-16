import { Injectable } from "@nestjs/common";
import {
  MetaKernelArchitectureRule,
  MetaKernelAssessment,
  MetaKernelUpgradePlan
} from "../enterprise-kernel-mega-pack-7.types";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class MetaKernelGovernanceService {
  private readonly rules =
    new Map<string, MetaKernelArchitectureRule>();

  private readonly assessments =
    new Map<string, MetaKernelAssessment>();

  private readonly upgradePlans =
    new Map<string, MetaKernelUpgradePlan>();

  constructor(
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {
    this.seed();
  }

  listRules() {
    return Array.from(this.rules.values());
  }

  assess(input: {
    subjectId: string;
    checks: Record<string, boolean>;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const activeRules = this.listRules().filter((rule) => rule.active);
    const passedRuleIds: string[] = [];
    const failedRuleIds: string[] = [];
    const conditions: string[] = [];
    const findings: string[] = [];

    for (const rule of activeRules) {
      const passed = rule.checks.every(
        (check) => input.checks[check] === true
      );

      if (passed) {
        passedRuleIds.push(rule.id);
      }
      else {
        failedRuleIds.push(rule.id);
        findings.push(
          `Meta Kernel rule failed: ${rule.name}.`
        );

        if (!rule.mandatory) {
          conditions.push(
            `Resolve non-mandatory rule ${rule.id}.`
          );
        }
      }
    }

    const mandatoryFailed = activeRules.some(
      (rule) =>
        rule.mandatory &&
        failedRuleIds.includes(rule.id)
    );

    const score =
      activeRules.length === 0
        ? 100
        : Number(
            (
              passedRuleIds.length /
              activeRules.length *
              100
            ).toFixed(2)
          );

    const decision: MetaKernelAssessment["decision"] =
      mandatoryFailed
        ? "hold"
        : failedRuleIds.length > 0
          ? "allow-with-conditions"
          : "allow";

    const assessment: MetaKernelAssessment = {
      id: `meta-kernel-assessment:${Date.now()}:${
        this.assessments.size + 1
      }`,
      subjectId: input.subjectId,
      decision,
      score,
      passedRuleIds,
      failedRuleIds,
      conditions,
      findings,
      correlationId: input.correlationId,
      assessedAt: new Date().toISOString()
    };

    this.assessments.set(assessment.id, assessment);

    this.audit.record({
      correlationId: input.correlationId,
      category: "meta-kernel",
      action: "meta-kernel-architecture-assessed",
      subjectId: assessment.id,
      actorIdentityId: input.actorIdentityId,
      outcome:
        decision === "allow"
          ? "success"
          : decision === "allow-with-conditions"
            ? "warning"
            : "blocked",
      metadata: {
        subjectId: input.subjectId,
        score,
        decision
      }
    });

    return assessment;
  }

  createUpgradePlan(input: {
    subjectId: string;
    fromVersion: string;
    toVersion: string;
    compatibilityAssessmentId: string;
    steps: string[];
    rollbackSteps: string[];
    requiresHumanApproval: boolean;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const plan: MetaKernelUpgradePlan = {
      id: `meta-kernel-upgrade-plan:${Date.now()}:${
        this.upgradePlans.size + 1
      }`,
      subjectId: input.subjectId,
      fromVersion: input.fromVersion,
      toVersion: input.toVersion,
      steps: Array.from(new Set(input.steps)),
      rollbackSteps: Array.from(new Set(input.rollbackSteps)),
      compatibilityAssessmentId:
        input.compatibilityAssessmentId,
      requiresHumanApproval:
        input.requiresHumanApproval,
      status: "draft",
      correlationId: input.correlationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.upgradePlans.set(plan.id, plan);

    this.audit.record({
      correlationId: input.correlationId,
      category: "meta-kernel",
      action: "meta-kernel-upgrade-plan-created",
      subjectId: plan.id,
      actorIdentityId: input.actorIdentityId,
      outcome: plan.requiresHumanApproval
        ? "warning"
        : "success",
      metadata: {
        subjectId: plan.subjectId,
        fromVersion: plan.fromVersion,
        toVersion: plan.toVersion
      }
    });

    return plan;
  }

  approveUpgrade(input: {
    planId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const current = this.upgradePlans.get(input.planId);

    if (!current) {
      throw new Error(
        `Meta Kernel upgrade plan not found: ${input.planId}`
      );
    }

    const updated: MetaKernelUpgradePlan = {
      ...current,
      approvedByIdentityId: input.approvedByIdentityId,
      status: "approved",
      updatedAt: new Date().toISOString()
    };

    this.upgradePlans.set(updated.id, updated);
    return updated;
  }

  executeUpgrade(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
    simulateFailure?: boolean;
  }) {
    const current = this.upgradePlans.get(input.planId);

    if (!current) {
      throw new Error(
        `Meta Kernel upgrade plan not found: ${input.planId}`
      );
    }

    if (
      current.requiresHumanApproval &&
      !current.approvedByIdentityId
    ) {
      throw new Error(
        "Meta Kernel upgrade requires human approval."
      );
    }

    const updated: MetaKernelUpgradePlan = {
      ...current,
      status: input.simulateFailure
        ? "failed"
        : "completed",
      updatedAt: new Date().toISOString()
    };

    this.upgradePlans.set(updated.id, updated);

    return updated;
  }

  rollbackUpgrade(input: {
    planId: string;
    actorIdentityId: string;
    correlationId: string;
  }) {
    const current = this.upgradePlans.get(input.planId);

    if (!current) {
      throw new Error(
        `Meta Kernel upgrade plan not found: ${input.planId}`
      );
    }

    const updated: MetaKernelUpgradePlan = {
      ...current,
      status: "rolled-back",
      updatedAt: new Date().toISOString()
    };

    this.upgradePlans.set(updated.id, updated);

    return updated;
  }

  listAssessments() {
    return Array.from(this.assessments.values());
  }

  listUpgradePlans() {
    return Array.from(this.upgradePlans.values());
  }

  summary() {
    const assessments = this.listAssessments();
    const plans = this.listUpgradePlans();

    return {
      rules: this.rules.size,
      activeRules: this.listRules().filter((x) => x.active).length,
      assessments: assessments.length,
      allowed: assessments.filter((x) => x.decision === "allow").length,
      held: assessments.filter((x) => x.decision === "hold").length,
      upgradePlans: plans.length,
      completedUpgrades:
        plans.filter((x) => x.status === "completed").length,
      rollbacks:
        plans.filter((x) => x.status === "rolled-back").length
    };
  }

  private seed() {
    const now = new Date().toISOString();

    const rules: MetaKernelArchitectureRule[] = [
      {
        id: "meta-kernel-rule:compatibility",
        name: "Compatibility Required",
        description:
          "Kernel changes require compatibility validation.",
        category: "compatibility",
        mandatory: true,
        active: true,
        checks: ["compatibilityValidated"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "meta-kernel-rule:rollback",
        name: "Rollback Required",
        description:
          "Kernel changes require a rollback path.",
        category: "rollback",
        mandatory: true,
        active: true,
        checks: ["rollbackAvailable"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "meta-kernel-rule:security",
        name: "Security Preserved",
        description:
          "Kernel security and human authority must remain preserved.",
        category: "security",
        mandatory: true,
        active: true,
        checks: [
          "securityPreserved",
          "humanFinalAuthorityPreserved"
        ],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "meta-kernel-rule:observability",
        name: "Observability Required",
        description:
          "Kernel evolution must remain observable and traceable.",
        category: "observability",
        mandatory: true,
        active: true,
        checks: [
          "observabilityActive",
          "traceabilityActive"
        ],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "meta-kernel-rule:governance",
        name: "Governance Approval",
        description:
          "Kernel architecture changes require governed approval.",
        category: "governance",
        mandatory: true,
        active: true,
        checks: ["governanceApproved"],
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const rule of rules) {
      this.rules.set(rule.id, rule);
    }
  }
}
