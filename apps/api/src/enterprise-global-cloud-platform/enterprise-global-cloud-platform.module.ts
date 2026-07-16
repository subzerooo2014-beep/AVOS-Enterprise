import { Module } from "@nestjs/common";
import { CloudDeploymentOrchestratorService } from "./cloud-deployment-orchestrator.service";
import { CloudGovernanceService } from "./cloud-governance.service";
import { CloudRegionRegistryService } from "./cloud-region-registry.service";
import { EnterpriseGlobalCloudPlatformController } from "./enterprise-global-cloud-platform.controller";
import { EnterpriseGlobalCloudPlatformService } from "./enterprise-global-cloud-platform.service";
import { GlobalConfigurationFederationService } from "./global-configuration-federation.service";
import { GlobalTrafficRouterService } from "./global-traffic-router.service";
import { ReleaseChannelManagerService } from "./release-channel-manager.service";

@Module({
  controllers: [EnterpriseGlobalCloudPlatformController],
  providers: [
    CloudDeploymentOrchestratorService,
    CloudGovernanceService,
    CloudRegionRegistryService,
    EnterpriseGlobalCloudPlatformService,
    GlobalConfigurationFederationService,
    GlobalTrafficRouterService,
    ReleaseChannelManagerService,
  ],
  exports: [
    CloudDeploymentOrchestratorService,
    CloudGovernanceService,
    CloudRegionRegistryService,
    EnterpriseGlobalCloudPlatformService,
    GlobalConfigurationFederationService,
    GlobalTrafficRouterService,
    ReleaseChannelManagerService,
  ],
})
export class EnterpriseGlobalCloudPlatformModule {}
