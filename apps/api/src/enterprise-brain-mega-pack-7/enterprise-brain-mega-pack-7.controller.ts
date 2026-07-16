import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import { EnterpriseBrainMegaPack7Service } from "./enterprise-brain-mega-pack-7.service";
import { EnterpriseBrainPackRegistryService } from "./registry/enterprise-brain-pack-registry.service";
import { EnterpriseBrainCrossValidationService } from "./validation/enterprise-brain-cross-validation.service";
import { EnterpriseBrainManifestService } from "./manifest/enterprise-brain-manifest.service";
import { EnterpriseBrainEvidenceVaultService } from "./evidence/enterprise-brain-evidence-vault.service";
import { EnterpriseBrainCertificationService } from "./certification/enterprise-brain-certification.service";
import { EnterpriseBrainFinalSmokeTestService } from "./smoke/enterprise-brain-final-smoke-test.service";
import { EnterpriseBrainReleaseDecisionService } from "./release/enterprise-brain-release-decision.service";
import { EnterpriseBrainFinalHealthService } from "./health/enterprise-brain-final-health.service";
import { EnterpriseBrainFinalAuditService } from "./observability/enterprise-brain-final-audit.service";

@Controller("enterprise-brain-v7")
export class EnterpriseBrainMegaPack7Controller {
  constructor(
    private readonly pack: EnterpriseBrainMegaPack7Service,
    private readonly packs: EnterpriseBrainPackRegistryService,
    private readonly validation: EnterpriseBrainCrossValidationService,
    private readonly manifests: EnterpriseBrainManifestService,
    private readonly evidence: EnterpriseBrainEvidenceVaultService,
    private readonly certifications: EnterpriseBrainCertificationService,
    private readonly smoke: EnterpriseBrainFinalSmokeTestService,
    private readonly release: EnterpriseBrainReleaseDecisionService,
    private readonly health: EnterpriseBrainFinalHealthService,
    private readonly audit: EnterpriseBrainFinalAuditService
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
