import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryReleaseHealthService
} from "./avos-factory-release-health.service";
import {
  AvosFactoryPostDeploymentVerificationService
} from "./avos-factory-post-deployment-verification.service";
import {
  AvosFactoryRecoveryGovernanceService
} from "./avos-factory-recovery-governance.service";
import {
  AvosFactoryReleaseHealthSmokeService
} from "./avos-factory-release-health-smoke.service";

@Controller("avos/factory/v1/release-health")
export class AvosFactoryReleaseHealthController {
  constructor(
    private readonly health: AvosFactoryReleaseHealthService,
    private readonly verification: AvosFactoryPostDeploymentVerificationService,
    private readonly recovery: AvosFactoryRecoveryGovernanceService,
    private readonly smoke: AvosFactoryReleaseHealthSmokeService
  ) {}

  @Post("evaluate")
  evaluate(
    @Body()
    input: Parameters<AvosFactoryReleaseHealthService["evaluate"]>[0]
  ) {
    return this.health.evaluate(input);
  }

  @Get("reports")
  reports(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.health.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Get("reports/:id")
  report(@Param("id") id: string) {
    return this.health.get(id) ?? null;
  }

  @Post("verify")
  verify(
    @Body()
    input: Parameters<
      AvosFactoryPostDeploymentVerificationService["verify"]
    >[0]
  ) {
    return this.verification.verify(input);
  }

  @Get("verifications")
  verifications(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.verification.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("recovery/recommend")
  recommend(
    @Body()
    input: Parameters<AvosFactoryRecoveryGovernanceService["recommend"]>[0]
  ) {
    return this.recovery.recommend(input);
  }

  @Post("recovery/approve")
  approve(
    @Body()
    input: Parameters<
      AvosFactoryRecoveryGovernanceService["approveRollback"]
    >[0]
  ) {
    return this.recovery.approveRollback(input);
  }

  @Post("recovery/execute")
  execute(
    @Body()
    input: Parameters<
      AvosFactoryRecoveryGovernanceService["executeApprovedRollback"]
    >[0]
  ) {
    return this.recovery.executeApprovedRollback(input);
  }

  @Get("recovery")
  recoveryList(@Query("limit") limit?: string) {
    const parsed = Number(limit);

    return {
      items: this.recovery.list(
        Number.isFinite(parsed) ? Math.trunc(parsed) : 100
      )
    };
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }
}
