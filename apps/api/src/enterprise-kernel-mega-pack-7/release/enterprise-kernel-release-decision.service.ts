import { Injectable } from "@nestjs/common";
import { KernelReleaseDecision } from "../enterprise-kernel-mega-pack-7.types";
import { EnterpriseKernelCertificationService } from "../certification/enterprise-kernel-certification.service";
import { EnterpriseKernelFinalSmokeTestService } from "../smoke/enterprise-kernel-final-smoke-test.service";
import { MetaKernelGovernanceService } from "../meta-kernel/meta-kernel-governance.service";
import { EnterpriseKernelFinalAuditService } from "../observability/enterprise-kernel-final-audit.service";

@Injectable()
export class EnterpriseKernelReleaseDecisionService {
  private readonly decisions =
    new Map<string, KernelReleaseDecision>();

  constructor(
    private readonly certifications: EnterpriseKernelCertificationService,
    private readonly smoke: EnterpriseKernelFinalSmokeTestService,
    private readonly metaKernel: MetaKernelGovernanceService,
    private readonly audit: EnterpriseKernelFinalAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  decide(input: {
    decidedByIdentityId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const certification =
      this.certifications.latest();

    const smoke = this.smoke.latest();

    const reasons: string[] = [];
    const conditions: string[] = [];

    let decision: KernelReleaseDecision["decision"] =
      "hold-enterprise-kernel";

    if (
      certification?.status === "certified" &&
      smoke?.runtimeReady === true &&
      smoke.score === 100
    ) {
      decision = "release-enterprise-kernel";
      reasons.push(
        "Enterprise Kernel certification and final smoke test passed."
      );
    }
    else if (
      certification?.status === "conditional" &&
      smoke &&
      smoke.score >= 90
    ) {
      decision = "conditional-release";
      conditions.push(
        ...certification.conditions
      );
    }
    else {
      reasons.push(
        "Enterprise Kernel release requirements are not fully satisfied."
      );
    }

    const score = Math.min(
      certification?.score ?? 0,
      smoke?.score ?? 0
    );

    const release: KernelReleaseDecision = {
      id: `enterprise-kernel-release:${Date.now()}:${
        this.decisions.size + 1
      }`,
      decision,
      certificationId:
        certification?.id,
      smokeTestId:
        smoke?.id,
      score,
      reasons,
      conditions:
        Array.from(new Set(conditions)),
      decidedByIdentityId:
        input.decidedByIdentityId,
      approvedByIdentityId:
        input.approvedByIdentityId,
      correlationId:
        input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.decisions.set(release.id, release);

    this.audit.record({
      correlationId: input.correlationId,
      category: "release",
      action: "enterprise-kernel-release-decided",
      subjectId: release.id,
      actorIdentityId:
        input.approvedByIdentityId,
      outcome:
        decision === "release-enterprise-kernel"
          ? "success"
          : decision === "conditional-release"
            ? "warning"
            : "blocked",
      metadata: {
        decision,
        score
      }
    });

    return release;
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  summary() {
    const items = this.list();

    return {
      total: items.length,
      released:
        items.filter(
          (x) =>
            x.decision === "release-enterprise-kernel"
        ).length,
      conditional:
        items.filter(
          (x) =>
            x.decision === "conditional-release"
        ).length,
      held:
        items.filter(
          (x) =>
            x.decision === "hold-enterprise-kernel"
        ).length
    };
  }
}
