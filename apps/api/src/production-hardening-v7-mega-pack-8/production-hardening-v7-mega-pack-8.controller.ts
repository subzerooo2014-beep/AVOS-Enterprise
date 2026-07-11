import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ActivateKillSwitchDto,
  ApproveConfigurationDto,
  CreateBaselineDto,
  CreateConfigurationDto,
  CreateFeatureFlagDto,
  CreateKillSwitchDto,
  CreatePolicyDto,
  ReleaseKillSwitchDto,
  RollbackConfigurationDto,
  UpdateFeatureFlagDto,
} from "./production-hardening-v7-mega-pack-8.dto";
import { ProductionHardeningV7MegaPack8Service } from "./production-hardening-v7-mega-pack-8.service";

@Controller(
  "production-hardening-v7/mega-pack-8",
)
export class ProductionHardeningV7MegaPack8Controller {
  constructor(
    private readonly service:
      ProductionHardeningV7MegaPack8Service,
  ) {}

  @Get("status")
  getStatus() {
    return this.service.getStatus();
  }

  @Get("snapshot")
  getSnapshot() {
    return this.service.getSnapshot();
  }

  @Get("evidence/verify")
  verifyEvidence() {
    return this.service.verifyEvidenceChain();
  }

  @Get("configurations")
  listConfigurations() {
    return this.service.listConfigurations();
  }

  @Post("configurations")
  createConfiguration(
    @Body()
    dto: CreateConfigurationDto,
  ) {
    return this.service.createConfiguration(
      dto,
    );
  }

  @Post(
    "configurations/:configurationId/approval",
  )
  approveConfiguration(
    @Param("configurationId")
    configurationId: string,
    @Body()
    dto: ApproveConfigurationDto,
  ) {
    return this.service.approveConfiguration(
      configurationId,
      dto,
    );
  }

  @Post(
    "configurations/:configurationId/rollback",
  )
  rollbackConfiguration(
    @Param("configurationId")
    configurationId: string,
    @Body()
    dto: RollbackConfigurationDto,
  ) {
    return this.service.rollbackConfiguration(
      configurationId,
      dto,
    );
  }

  @Get("policies")
  listPolicies() {
    return this.service.listPolicies();
  }

  @Post("policies")
  createPolicy(
    @Body() dto: CreatePolicyDto,
  ) {
    return this.service.createPolicy(dto);
  }

  @Post("baselines")
  createBaseline(
    @Body() dto: CreateBaselineDto,
  ) {
    return this.service.createBaseline(
      dto,
    );
  }

  @Post("baselines/:baselineId/scan")
  scanDrift(
    @Param("baselineId")
    baselineId: string,
  ) {
    return this.service.scanDrift(
      baselineId,
    );
  }

  @Post("feature-flags")
  createFeatureFlag(
    @Body() dto: CreateFeatureFlagDto,
  ) {
    return this.service.createFeatureFlag(
      dto,
    );
  }

  @Put("feature-flags/:flagId")
  updateFeatureFlag(
    @Param("flagId") flagId: string,
    @Body() dto: UpdateFeatureFlagDto,
  ) {
    return this.service.updateFeatureFlag(
      flagId,
      dto,
    );
  }

  @Get("feature-flags/:flagId/evaluate")
  evaluateFeatureFlag(
    @Param("flagId") flagId: string,
    @Query("userId") userId?: string,
    @Query("service") service?: string,
  ) {
    return this.service.evaluateFeatureFlag(
      flagId,
      {
        userId,
        service,
      },
    );
  }

  @Post("kill-switches")
  createKillSwitch(
    @Body() dto: CreateKillSwitchDto,
  ) {
    return this.service.createKillSwitch(
      dto,
    );
  }

  @Post(
    "kill-switches/:switchId/activate",
  )
  activateKillSwitch(
    @Param("switchId")
    switchId: string,
    @Body()
    dto: ActivateKillSwitchDto,
  ) {
    return this.service.activateKillSwitch(
      switchId,
      dto,
    );
  }

  @Post(
    "kill-switches/:switchId/release",
  )
  releaseKillSwitch(
    @Param("switchId")
    switchId: string,
    @Body()
    dto: ReleaseKillSwitchDto,
  ) {
    return this.service.releaseKillSwitch(
      switchId,
      dto,
    );
  }
}
