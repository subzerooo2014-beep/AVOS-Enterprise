import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack20Service } from "./foundation-completion-pack-20.service";
import { FoundationPackRegistryService } from "./registry/foundation-pack-registry.service";
import { CrossFoundationValidationService } from "./validation/cross-foundation-validation.service";
import { FoundationCertificationService } from "./certification/foundation-certification.service";
import { FoundationManifestService } from "./manifest/foundation-manifest.service";
import { FoundationEvidenceVaultService } from "./evidence/foundation-evidence-vault.service";
import { FoundationFinalSmokeTestService } from "./smoke/foundation-final-smoke-test.service";
import { FoundationReleaseDecisionService } from "./release/foundation-release-decision.service";
import { FoundationFinalHealthService } from "./health/foundation-final-health.service";
import { FoundationFinalAuditService } from "./observability/foundation-final-audit.service";
import {
  FoundationEvidenceRecord,
  FoundationPackStatus
} from "./foundation-pack-20.types";

@Controller("foundation-completion-v20")
export class FoundationCompletionPack20Controller {
  constructor(
    private readonly pack: FoundationCompletionPack20Service,
    private readonly registry: FoundationPackRegistryService,
    private readonly validation: CrossFoundationValidationService,
    private readonly certifications: FoundationCertificationService,
    private readonly manifests: FoundationManifestService,
    private readonly evidence: FoundationEvidenceVaultService,
    private readonly smoke: FoundationFinalSmokeTestService,
    private readonly release: FoundationReleaseDecisionService,
    private readonly health: FoundationFinalHealthService,
    private readonly audit: FoundationFinalAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("packs")
  packList() {
    return {
      summary: this.registry.summary(),
      items: this.registry.list()
    };
  }

  @Get("packs/:id")
  packById(@Param("id") id: string) {
    return this.registry.get(id);
  }

  @Post("packs/:id/update")
  updatePack(
    @Param("id") id: string,
    @Body()
    body: {
      status?: FoundationPackStatus;
      verificationPassed?: boolean;
      buildPassed?: boolean;
      healthStatus?:
        | "healthy"
        | "degraded"
        | "critical"
        | "unknown";
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.registry.update(
      id,
      {
        status: body.status,
        verificationPassed:
          body.verificationPassed,
        buildPassed: body.buildPassed,
        healthStatus: body.healthStatus,
        metadata: body.metadata
      },
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("validation/run")
  runValidation(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.validation.run(body);
  }

  @Get("validation/reports")
  validationReports() {
    return {
      summary: this.validation.summary(),
      items: this.validation.list()
    };
  }

  @Post("certifications")
  issueCertification(
    @Body()
    body: {
      validationReportId: string;
      certifiedByIdentityId: string;
      approvedByIdentityId?: string;
      correlationId: string;
      expiresAt?: string;
    }
  ) {
    return this.certifications.issue(body);
  }

  @Get("certifications")
  certificationList() {
    return {
      summary: this.certifications.summary(),
      items: this.certifications.list()
    };
  }

  @Post("certifications/:id/revoke")
  revokeCertification(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
    }
  ) {
    return this.certifications.revoke({
      certificationId: id,
      ...body
    });
  }

  @Post("manifests")
  generateManifest(
    @Body()
    body: {
      releaseVersion: string;
      generatedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.manifests.generate(body);
  }

  @Get("manifests")
  manifestList() {
    return {
      summary: this.manifests.summary(),
      items: this.manifests.list()
    };
  }

  @Post("evidence")
  addEvidence(
    @Body()
    body: {
      category: FoundationEvidenceRecord["category"];
      subjectId: string;
      outcome: FoundationEvidenceRecord["outcome"];
      details: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.evidence.add(body);
  }

  @Get("evidence")
  evidenceList() {
    return {
      summary: this.evidence.summary(),
      items: this.evidence.list()
    };
  }

  @Post("smoke/run")
  runSmoke(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.smoke.run(body);
  }

  @Get("smoke/results")
  smokeResults() {
    return {
      summary: this.smoke.summary(),
      items: this.smoke.list()
    };
  }

  @Post("release/decide")
  decideRelease(
    @Body()
    body: {
      decidedByIdentityId: string;
      approvedByIdentityId?: string;
      correlationId: string;
    }
  ) {
    return this.release.decide(body);
  }

  @Get("release/decisions")
  releaseDecisions() {
    return {
      summary: this.release.summary(),
      items: this.release.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
