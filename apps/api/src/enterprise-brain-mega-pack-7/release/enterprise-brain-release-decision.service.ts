import { Injectable } from "@nestjs/common";
import { EnterpriseBrainReleaseDecision } from "../enterprise-brain-mega-pack-7.types";
import { EnterpriseBrainCertificationService } from "../certification/enterprise-brain-certification.service";
import { EnterpriseBrainFinalSmokeTestService } from "../smoke/enterprise-brain-final-smoke-test.service";
import { EnterpriseBrainManifestService } from "../manifest/enterprise-brain-manifest.service";
import { EnterpriseBrainFinalAuditService } from "../observability/enterprise-brain-final-audit.service";

@Injectable()
export class EnterpriseBrainReleaseDecisionService {
  private readonly decisions =
    new Map<string, EnterpriseBrainReleaseDecision>();

  constructor(
    private readonly certifications: EnterpriseBrainCertificationService,
    private readonly smoke: EnterpriseBrainFinalSmokeTestService,
    private readonly manifests: EnterpriseBrainManifestService,
    private readonly audit: EnterpriseBrainFinalAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  latest() {
    const items = this.list();

    return items.length === 0
      ? undefined
      : items[items.length - 1];
  }

  decide(input: {
    decidedByIdentityId: string;
    approvedByIdentityId: string;
    correlationId: string;
  }) {
    const certification = this.certifications.latest();
    const smoke = this.smoke.latest();
    const manifest = this.manifests.latest();

    const reasons: string[] = [];
    const conditions: string[] = [];

    let decision: EnterpriseBrainReleaseDecision["decision"] =
      "hold-enterprise-brain";

    if (
      certification?.status === "certified" &&
      smoke?.runtimeReady === true &&
      smoke.score === 100 &&
      manifest?.status === "certified"
    ) {
      decision = "release-enterprise-brain";
      reasons.push(
        "Enterprise Brain certification, manifest, and final smoke test passed."
      );
    }
    else if (
      certification?.status === "conditional" &&
      smoke &&
      smoke.score >= 90
    ) {
      decision = "conditional-release";
      conditions.push(...certification.conditions);
    }
    else {
      reasons.push(
        "Enterprise Brain release requirements are not fully satisfied."
      );
    }

    const score = Math.min(
      certification?.score ?? 0,
      smoke?.score ?? 0
    );

    const release: EnterpriseBrainReleaseDecision = {
      id: `enterprise-brain-release:${Date.now()}:${
        this.decisions.size + 1
      }`,
      decision,
      certificationId: certification?.id,
      smokeTestId: smoke?.id,
      manifestId: manifest?.id,
      score,
      reasons,
      conditions,
      decidedByIdentityId: input.decidedByIdentityId,
      approvedByIdentityId: input.approvedByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.decisions.set(release.id, release);

    this.audit.record({
      correlationId: input.correlationId,
      category: "release",
      action: "enterprise-brain-release-decided",
      subjectId: release.id,
      actorIdentityId: input.approvedByIdentityId,
      outcome:
        decision === "release-enterprise-brain"
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

  summary() {
    const items = this.list();

    return {
      total: items.length,
      released:
        items.filter(
          (x) => x.decision === "release-enterprise-brain"
        ).length,
      conditional:
        items.filter(
          (x) => x.decision === "conditional-release"
        ).length,
      held:
        items.filter(
          (x) => x.decision === "hold-enterprise-brain"
        ).length
    };
  }
}
