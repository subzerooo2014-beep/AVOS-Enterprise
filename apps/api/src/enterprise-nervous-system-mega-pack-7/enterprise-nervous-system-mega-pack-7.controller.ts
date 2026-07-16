import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { EnterpriseNervousSystemMegaPack7Service } from "./enterprise-nervous-system-mega-pack-7.service";
import { NervousSystemPackRegistryService } from "./registry/nervous-system-pack-registry.service";
import { NervousSystemCrossValidationService } from "./validation/nervous-system-cross-validation.service";
import { NervousSystemManifestService } from "./manifest/nervous-system-manifest.service";
import { NervousSystemEvidenceVaultService } from "./evidence/nervous-system-evidence-vault.service";
import { NervousSystemCertificationService } from "./certification/nervous-system-certification.service";
import { NervousSystemFinalSmokeTestService } from "./smoke/nervous-system-final-smoke-test.service";
import { NervousSystemReleaseDecisionService } from "./release/nervous-system-release-decision.service";
import { NervousSystemFinalHealthService } from "./health/nervous-system-final-health.service";
import { NervousSystemFinalAuditService } from "./observability/nervous-system-final-audit.service";

@Controller("enterprise-nervous-system-v7")
export class EnterpriseNervousSystemMegaPack7Controller {
  constructor(
    private readonly pack: EnterpriseNervousSystemMegaPack7Service,
    private readonly packs: NervousSystemPackRegistryService,
    private readonly validation: NervousSystemCrossValidationService,
    private readonly manifests: NervousSystemManifestService,
    private readonly evidence: NervousSystemEvidenceVaultService,
    private readonly certifications: NervousSystemCertificationService,
    private readonly smoke: NervousSystemFinalSmokeTestService,
    private readonly release: NervousSystemReleaseDecisionService,
    private readonly health: NervousSystemFinalHealthService,
    private readonly audit: NervousSystemFinalAuditService
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
      summary: this.packs.summary(),
      items: this.packs.list()
    };
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

  @Get("validation")
  validationList() {
    return {
      summary: this.validation.summary(),
      items: this.validation.list()
    };
  }

  @Post("manifests")
  createManifest(
    @Body()
    body: {
      validationReportId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.manifests.create(body);
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
      subjectId: string;
      category:
        | "pack"
        | "validation"
        | "manifest"
        | "certification"
        | "smoke"
        | "release"
        | "health";
      outcome: "passed" | "failed" | "warning";
      details: Record<string, unknown>;
      correlationId: string;
      createdByIdentityId: string;
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

  @Post("certifications")
  issueCertification(
    @Body()
    body: {
      validationReportId: string;
      manifestId: string;
      certifiedByIdentityId: string;
      approvedByIdentityId: string;
      correlationId: string;
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

  @Get("smoke")
  smokeList() {
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
      approvedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.release.decide(body);
  }

  @Get("release")
  releaseList() {
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

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
