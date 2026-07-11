import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { CreateClosureDto } from "./dto/create-closure.dto";
import { CreateConsistencyCheckDto } from "./dto/create-consistency-check.dto";
import { CreateTransitionPackageDto } from "./dto/create-transition-package.dto";
import { RegisterMegaPackValidationDto } from "./dto/register-mega-pack-validation.dto";
import { ProductionHardeningV7MegaPack16Service } from "./production-hardening-v7-mega-pack-16.service";

@Controller("production-hardening-v7-mega-pack-16")
export class ProductionHardeningV7MegaPack16Controller {
  constructor(
    private readonly service:
      ProductionHardeningV7MegaPack16Service,
  ) {}

  @Get("status")
  status() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  snapshot() {
    return {
      success: true,
      snapshot:
        this.service.getSnapshot(),
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
      entries:
        this.service.listEvidenceEntries(),
    };
  }

  @Get("events")
  events() {
    return {
      success: true,
      events:
        this.service.listPlatformEvents(),
    };
  }

  @Post("closures")
  createClosure(
    @Body() dto: CreateClosureDto,
  ) {
    return {
      success: true,
      closure:
        this.service.createClosure(
          dto,
          "api",
        ),
    };
  }

  @Get("closures")
  listClosures() {
    return {
      success: true,
      closures:
        this.service.listClosures(),
    };
  }

  @Get("closures/:closureId")
  getClosure(
    @Param("closureId")
    closureId: string,
  ) {
    return {
      success: true,
      closure:
        this.service.getClosure(
          closureId,
        ),
    };
  }

  @Post("closures/:closureId/mega-pack-validations")
  registerMegaPackValidation(
    @Param("closureId")
    closureId: string,
    @Body()
    dto: RegisterMegaPackValidationDto,
  ) {
    return {
      success: true,
      validation:
        this.service.registerMegaPackValidation(
          closureId,
          dto,
          "api",
        ),
    };
  }

  @Get("mega-pack-validations")
  listMegaPackValidations(
    @Query("closureId")
    closureId?: string,
  ) {
    return {
      success: true,
      validations:
        this.service.listMegaPackValidations(
          closureId,
        ),
    };
  }

  @Post("closures/:closureId/consistency-checks")
  createConsistencyCheck(
    @Param("closureId")
    closureId: string,
    @Body()
    dto: CreateConsistencyCheckDto,
  ) {
    return {
      success: true,
      check:
        this.service.createConsistencyCheck(
          closureId,
          dto,
          "api",
        ),
    };
  }

  @Get("consistency-checks")
  listConsistencyChecks(
    @Query("closureId")
    closureId?: string,
  ) {
    return {
      success: true,
      checks:
        this.service.listConsistencyChecks(
          closureId,
        ),
    };
  }

  @Post("closures/:closureId/create-baseline")
  createBaseline(
    @Param("closureId")
    closureId: string,
  ) {
    return {
      success: true,
      baseline:
        this.service.createImmutableBaseline(
          closureId,
          "api",
        ),
    };
  }

  @Post("baselines/:baselineId/seal")
  sealBaseline(
    @Param("baselineId")
    baselineId: string,
  ) {
    return {
      success: true,
      baseline:
        this.service.sealBaseline(
          baselineId,
          "api",
        ),
    };
  }

  @Post("baselines/:baselineId/verify")
  verifyBaseline(
    @Param("baselineId")
    baselineId: string,
  ) {
    return {
      success: true,
      baseline:
        this.service.verifyBaseline(
          baselineId,
          "api",
        ),
    };
  }

  @Get("baselines")
  listBaselines() {
    return {
      success: true,
      baselines:
        this.service.listBaselines(),
    };
  }

  @Post("closures/:closureId/executive-report")
  generateExecutiveReport(
    @Param("closureId")
    closureId: string,
  ) {
    return {
      success: true,
      report:
        this.service.generateExecutiveReport(
          closureId,
          "api",
        ),
    };
  }

  @Get("executive-reports")
  listExecutiveReports() {
    return {
      success: true,
      reports:
        this.service.listExecutiveReports(),
    };
  }

  @Post("closures/:closureId/issue-certificate")
  issueCertificate(
    @Param("closureId")
    closureId: string,
  ) {
    return {
      success: true,
      certificate:
        this.service.issueCompletionCertificate(
          closureId,
          "api",
        ),
    };
  }

  @Get("certificates")
  listCertificates() {
    return {
      success: true,
      certificates:
        this.service.listCertificates(),
    };
  }

  @Post("closures/:closureId/transition-package")
  createTransitionPackage(
    @Param("closureId")
    closureId: string,
    @Body()
    dto: CreateTransitionPackageDto,
  ) {
    return {
      success: true,
      transitionPackage:
        this.service.createTransitionPackage(
          closureId,
          dto,
          "api",
        ),
    };
  }

  @Post("transition-packages/:transitionPackageId/accept")
  acceptTransitionPackage(
    @Param("transitionPackageId")
    transitionPackageId: string,
  ) {
    return {
      success: true,
      transitionPackage:
        this.service.acceptTransitionPackage(
          transitionPackageId,
          "api",
        ),
    };
  }

  @Get("transition-packages")
  listTransitionPackages() {
    return {
      success: true,
      transitionPackages:
        this.service.listTransitionPackages(),
    };
  }

  @Post("closures/:closureId/complete")
  completeClosure(
    @Param("closureId")
    closureId: string,
  ) {
    return {
      success: true,
      closure:
        this.service.completeClosure(
          closureId,
          "api",
        ),
    };
  }
}
