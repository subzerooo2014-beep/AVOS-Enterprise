import {
  Body,
  Controller,
  Get,
  Post
} from "@nestjs/common";
import {
  FactoryEnforcedExecutionInput,
  FactoryEnforcedRollbackInput
} from "./avos-factory-enforcement.contracts";
import {
  AvosFactoryCertificationEnforcementService
} from "./avos-factory-certification-enforcement.service";
import {
  AvosFactoryEnforcementMetricsService
} from "./avos-factory-enforcement-metrics.service";
import {
  AvosFactoryEnforcementSmokeService
} from "./avos-factory-enforcement-smoke.service";
import {
  AvosFactoryExecutionEnforcementService
} from "./avos-factory-execution-enforcement.service";
import {
  AvosFactoryRollbackEnforcementService
} from "./avos-factory-rollback-enforcement.service";

@Controller("avos/factory/v1/enforcement")
export class AvosFactoryEnforcementController {
  constructor(
    private readonly execution:
      AvosFactoryExecutionEnforcementService,
    private readonly rollback:
      AvosFactoryRollbackEnforcementService,
    private readonly certification:
      AvosFactoryCertificationEnforcementService,
    private readonly metrics:
      AvosFactoryEnforcementMetricsService,
    private readonly smoke:
      AvosFactoryEnforcementSmokeService
  ) {}

  @Post("projects/execute")
  executeProject(
    @Body() input:
      FactoryEnforcedExecutionInput
  ) {
    return this.execution.execute(input);
  }

  @Post("projects/rollback")
  rollbackProject(
    @Body() input:
      FactoryEnforcedRollbackInput
  ) {
    return this.rollback.rollbackProject(
      input
    );
  }

  @Post("certification/certify")
  certify(
    @Body() input: {
      approvedBy: string;
      humanApproved: boolean;
      requestedBy?: string;
    }
  ) {
    return this.certification.certify(
      input
    );
  }

  @Get("metrics")
  metricsSnapshot() {
    return this.metrics.snapshot();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
