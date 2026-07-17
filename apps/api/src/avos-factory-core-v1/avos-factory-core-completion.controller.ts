import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryCoreCompletionValidationService
} from "./avos-factory-core-completion-validation.service";
import {
  AvosFactoryCoreCompletionCertificationService
} from "./avos-factory-core-completion-certification.service";
import {
  AvosFactoryCoreCompletionHealthService
} from "./avos-factory-core-completion-health.service";
import {
  AvosFactoryCoreCompletionSmokeService
} from "./avos-factory-core-completion-smoke.service";

@Controller("avos/factory/v1/core-completion")
export class AvosFactoryCoreCompletionCertificationController {
  constructor(
    private readonly validation: AvosFactoryCoreCompletionValidationService,
    private readonly certification: AvosFactoryCoreCompletionCertificationService,
    private readonly health: AvosFactoryCoreCompletionHealthService,
    private readonly smoke: AvosFactoryCoreCompletionSmokeService
  ) {}

  @Post("validate")
  validate(
    @Body()
    input: Parameters<AvosFactoryCoreCompletionValidationService["run"]>[0]
  ) {
    return this.validation.run(input);
  }

  @Get("validations")
  validations(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.validation.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("validations/:id")
  validationReport(@Param("id") id: string) {
    return this.validation.get(id) ?? null;
  }

  @Post("certify")
  certify(
    @Body()
    input: Parameters<
      AvosFactoryCoreCompletionCertificationService["certify"]
    >[0]
  ) {
    return this.certification.certify(input);
  }

  @Get("certifications")
  certifications(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.certification.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("health")
  finalHealth() {
    return this.health.calculate();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
