import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import {
  FoundationReleaseDecision
} from "../foundation-pack-20.types";
import { FoundationCertificationService } from "../certification/foundation-certification.service";
import { FoundationManifestService } from "../manifest/foundation-manifest.service";
import { FoundationEvidenceVaultService } from "../evidence/foundation-evidence-vault.service";
import { FoundationFinalSmokeTestService } from "../smoke/foundation-final-smoke-test.service";
import { FoundationFinalAuditService } from "../observability/foundation-final-audit.service";

@Injectable()
export class FoundationReleaseDecisionService {
  private readonly decisions =
    new Map<string, FoundationReleaseDecision>();

  constructor(
    private readonly certifications: FoundationCertificationService,
    private readonly manifests: FoundationManifestService,
    private readonly evidence: FoundationEvidenceVaultService,
    private readonly smoke: FoundationFinalSmokeTestService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  list() {
    return Array.from(this.decisions.values());
  }

  get(id: string) {
    const decision = this.decisions.get(id);

    if (!decision) {
      throw new NotFoundException(
        `Foundation release decision not found: ${id}`
      );
    }

    return decision;
  }

  decide(input: {
    decidedByIdentityId: string;
    approvedByIdentityId?: string;
    correlationId: string;
  }) {
    const certificationItems = this.certifications.list();
    const certification =
      certificationItems.length === 0
        ? undefined
        : certificationItems[certificationItems.length - 1];

    const manifestItems = this.manifests.list();
    const manifest =
      manifestItems.length === 0
        ? undefined
        : manifestItems[manifestItems.length - 1];

    const smokeItems = this.smoke.list();
    const smoke =
      smokeItems.length === 0
        ? undefined
        : smokeItems[smokeItems.length - 1];
    const evidence = this.evidence.list();

    const rationale: string[] = [];
    const conditions: string[] = [];

    let decision:
      FoundationReleaseDecision["decision"];

    if (
      certification &&
      manifest?.readiness.ready &&
      smoke?.runtimeReady &&
      input.approvedByIdentityId
    ) {
      decision = "release-foundation";
      rationale.push(
        "Foundation certification is valid."
      );
      rationale.push(
        "Foundation manifest is ready."
      );
      rationale.push(
        "Final smoke test passed."
      );
      rationale.push(
        "Human final approval is present."
      );
    }
    else if (
      certification &&
      manifest &&
      smoke &&
      input.approvedByIdentityId
    ) {
      decision = "conditional-release";
      conditions.push(
        "Resolve remaining readiness or smoke test findings before unrestricted higher-layer execution."
      );
    }
    else if (
      certification ||
      manifest ||
      smoke
    ) {
      decision = "hold-foundation";
      conditions.push(
        "Complete all final certification artifacts."
      );
    }
    else {
      decision = "reject-foundation";
      conditions.push(
        "Cross-foundation validation, manifest, certification, and smoke test are required."
      );
    }

    if (
      decision === "release-foundation" &&
      !input.approvedByIdentityId
    ) {
      throw new Error(
        "Foundation release requires explicit human approval."
      );
    }

    const record: FoundationReleaseDecision = {
      id: `foundation-release-decision:${Date.now()}:${
        this.decisions.size + 1
      }`,
      decision,
      certificationId: certification?.id,
      manifestId: manifest?.id,
      evidenceIds: evidence.map(
        (item) => item.id
      ),
      rationale,
      conditions,
      approvedByIdentityId:
        input.approvedByIdentityId,
      decidedByIdentityId:
        input.decidedByIdentityId,
      decidedAt: new Date().toISOString()
    };

    this.decisions.set(record.id, record);

    this.audit.record({
      correlationId: input.correlationId,
      category: "release",
      action: "foundation-release-decision-created",
      subjectId: record.id,
      actorIdentityId:
        input.decidedByIdentityId,
      outcome:
        decision === "release-foundation"
          ? "success"
          : decision === "conditional-release"
            ? "warning"
            : "blocked",
      metadata: {
        decision,
        approvedByIdentityId:
          input.approvedByIdentityId
      }
    });

    return record;
  }

  summary() {
    const decisions = this.list();

    return {
      total: decisions.length,
      released: decisions.filter(
        (item) =>
          item.decision === "release-foundation"
      ).length,
      conditional: decisions.filter(
        (item) =>
          item.decision === "conditional-release"
      ).length,
      held: decisions.filter(
        (item) =>
          item.decision === "hold-foundation"
      ).length
    };
  }
}
