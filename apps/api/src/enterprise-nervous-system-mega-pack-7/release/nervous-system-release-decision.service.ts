import { Injectable } from "@nestjs/common";
import { NervousSystemReleaseDecision } from "../enterprise-nervous-system-mega-pack-7.types";
import { NervousSystemCertificationService } from "../certification/nervous-system-certification.service";
import { NervousSystemFinalSmokeTestService } from "../smoke/nervous-system-final-smoke-test.service";
import { NervousSystemManifestService } from "../manifest/nervous-system-manifest.service";
import { NervousSystemFinalAuditService } from "../observability/nervous-system-final-audit.service";

@Injectable()
export class NervousSystemReleaseDecisionService {
  private readonly decisions =
    new Map<string, NervousSystemReleaseDecision>();

  constructor(
    private readonly certifications: NervousSystemCertificationService,
    private readonly smoke: NervousSystemFinalSmokeTestService,
    private readonly manifests: NervousSystemManifestService,
    private readonly audit: NervousSystemFinalAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  latest() {
    const items = this.list();
    return items.length === 0 ? undefined : items[items.length - 1];
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

    let decision: NervousSystemReleaseDecision["decision"] =
      "hold-enterprise-nervous-system";

    if (
      certification?.status === "certified" &&
      smoke?.runtimeReady === true &&
      smoke.score === 100 &&
      manifest?.status === "certified"
    ) {
      decision = "release-enterprise-nervous-system";
      reasons.push(
        "Enterprise Nervous System certification, manifest, and final smoke test passed."
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
        "Enterprise Nervous System release requirements are not fully satisfied."
      );
    }

    const score = Math.min(
      certification?.score ?? 0,
      smoke?.score ?? 0
    );

    const release: NervousSystemReleaseDecision = {
      id: `nervous-system-release:${Date.now()}:${
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
      action: "nervous-system-release-decided",
      subjectId: release.id,
      actorIdentityId: input.approvedByIdentityId,
      outcome:
        decision === "release-enterprise-nervous-system"
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
          (x) => x.decision === "release-enterprise-nervous-system"
        ).length,
      conditional:
        items.filter(
          (x) => x.decision === "conditional-release"
        ).length,
      held:
        items.filter(
          (x) => x.decision === "hold-enterprise-nervous-system"
        ).length
    };
  }
}
