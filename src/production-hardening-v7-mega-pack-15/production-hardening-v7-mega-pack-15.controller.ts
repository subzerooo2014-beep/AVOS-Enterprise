import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ConsolidateEvidenceDto } from "./dto/consolidate-evidence.dto";
import { CreateCertificationDto } from "./dto/create-certification.dto";
import { CreateExecutiveSignOffDto } from "./dto/create-executive-sign-off.dto";
import { CreateOperationalAcceptanceDto } from "./dto/create-operational-acceptance.dto";
import { EvaluateCertificationDto } from "./dto/evaluate-certification.dto";
import { ProductionHardeningV7MegaPack15Service } from "./production-hardening-v7-mega-pack-15.service";

@Controller("production-hardening-v7-mega-pack-15")
export class ProductionHardeningV7MegaPack15Controller {
  constructor(
    private readonly service: ProductionHardeningV7MegaPack15Service,
  ) {}

  @Get("status")
  status() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot: this.service.getSnapshot(),
    };
  }

  @Get("verify")
  verify() {
    return this.service.runVerification();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return {
      success: true,
      ...this.service.verifyEvidenceChain(),
    };
  }

  @Get("evidence")
  evidence() {
    return {
      success: true,
      entries: this.service.listEvidenceEntries(),
    };
  }

  @Get("events")
  events() {
    return {
      success: true,
      events: this.service.listPlatformEvents(),
    };
  }

  @Post("certifications")
  createCertification(
    @Body() dto: CreateCertificationDto,
  ) {
    return {
      success: true,
      certification:
        this.service.createCertification(dto, "api"),
    };
  }

  @Get("certifications")
  listCertifications() {
    return {
      success: true,
      certifications:
        this.service.listCertifications(),
    };
  }

  @Get("certifications/:certificationId")
  getCertification(
    @Param("certificationId")
    certificationId: string,
  ) {
    return {
      success: true,
      certification:
        this.service.getCertification(
          certificationId,
        ),
    };
  }

  @Post("certifications/:certificationId/evaluate")
  evaluateCertification(
    @Param("certificationId")
    certificationId: string,
    @Body() dto: EvaluateCertificationDto,
  ) {
    return {
      success: true,
      scorecard:
        this.service.evaluateCertification(
          certificationId,
          dto,
          "api",
        ),
    };
  }

  @Get("readiness-gates")
  listGates(
    @Query("certificationId")
    certificationId?: string,
  ) {
    return {
      success: true,
      gates:
        this.service.listGates(certificationId),
    };
  }

  @Get("scorecards")
  listScorecards() {
    return {
      success: true,
      scorecards:
        this.service.listScorecards(),
    };
  }

  @Post("certifications/:certificationId/operational-acceptance")
  createOperationalAcceptance(
    @Param("certificationId")
    certificationId: string,
    @Body() dto: CreateOperationalAcceptanceDto,
  ) {
    return {
      success: true,
      acceptance:
        this.service.createOperationalAcceptance(
          certificationId,
          dto,
          "api",
        ),
    };
  }

  @Post("operational-acceptances/:acceptanceId/approve")
  approveOperationalAcceptance(
    @Param("acceptanceId")
    acceptanceId: string,
  ) {
    return {
      success: true,
      acceptance:
        this.service.approveOperationalAcceptance(
          acceptanceId,
          "api",
        ),
    };
  }

  @Get("operational-acceptances")
  listOperationalAcceptances() {
    return {
      success: true,
      acceptances:
        this.service.listOperationalAcceptances(),
    };
  }

  @Post("certifications/:certificationId/executive-signoff")
  createExecutiveSignOff(
    @Param("certificationId")
    certificationId: string,
    @Body() dto: CreateExecutiveSignOffDto,
  ) {
    return {
      success: true,
      signOff:
        this.service.createExecutiveSignOff(
          certificationId,
          dto,
          "api",
        ),
    };
  }

  @Post("executive-signoffs/:signOffId/approve")
  approveExecutiveSignOff(
    @Param("signOffId") signOffId: string,
  ) {
    return {
      success: true,
      signOff:
        this.service.approveExecutiveSignOff(
          signOffId,
          "api",
        ),
    };
  }

  @Get("executive-signoffs")
  listExecutiveSignOffs() {
    return {
      success: true,
      signOffs:
        this.service.listExecutiveSignOffs(),
    };
  }

  @Post("certifications/:certificationId/consolidate-evidence")
  consolidateEvidence(
    @Param("certificationId")
    certificationId: string,
    @Body() dto: ConsolidateEvidenceDto,
  ) {
    return {
      success: true,
      consolidation:
        this.service.consolidateEvidence(
          certificationId,
          dto,
          "api",
        ),
    };
  }

  @Get("evidence-consolidations")
  listEvidenceConsolidations() {
    return {
      success: true,
      consolidations:
        this.service.listEvidenceConsolidations(),
    };
  }

  @Post("certifications/:certificationId/certify")
  certifyProduction(
    @Param("certificationId")
    certificationId: string,
  ) {
    return {
      success: true,
      certification:
        this.service.certifyProduction(
          certificationId,
          "api",
        ),
    };
  }

  @Post("certifications/:certificationId/issue-certificate")
  issueCertificateDocument(
    @Param("certificationId")
    certificationId: string,
  ) {
    return {
      success: true,
      certificate:
        this.service.issueCertificateDocument(
          certificationId,
          "api",
        ),
    };
  }

  @Get("certificate-documents")
  listCertificateDocuments() {
    return {
      success: true,
      certificates:
        this.service.listCertificateDocuments(),
    };
  }
}
