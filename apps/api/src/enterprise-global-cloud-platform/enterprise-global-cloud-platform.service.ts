import { Injectable } from "@nestjs/common";
import { CloudDeploymentOrchestratorService } from "./cloud-deployment-orchestrator.service";
import { CloudGovernanceService } from "./cloud-governance.service";
import { CloudRegionRegistryService } from "./cloud-region-registry.service";
import { GlobalConfigurationFederationService } from "./global-configuration-federation.service";
import { GlobalTrafficRouterService } from "./global-traffic-router.service";
import { ReleaseChannelManagerService } from "./release-channel-manager.service";
import type {
  GlobalCloudHealth,
  GlobalCloudMetrics,
} from "./enterprise-global-cloud.types";

@Injectable()
export class EnterpriseGlobalCloudPlatformService {
  constructor(
    private readonly regions: CloudRegionRegistryService,
    private readonly deployments: CloudDeploymentOrchestratorService,
    private readonly routes: GlobalTrafficRouterService,
    private readonly configuration: GlobalConfigurationFederationService,
    private readonly releases: ReleaseChannelManagerService,
    private readonly governance: CloudGovernanceService,
  ) {}

  metrics(): GlobalCloudMetrics {
    return {
      regions: this.regions.count(),
      activeRegions: this.regions.activeCount(),
      deployments: this.deployments.count(),
      successfulDeployments: this.deployments.successfulCount(),
      failedDeployments: this.deployments.failedCount(),
      routes: this.routes.count(),
      activeRoutes: this.routes.activeCount(),
      configurations: this.configuration.count(),
      releaseChannels: this.releases.count(),
      activeReleaseChannels: this.releases.activeCount(),
      governancePolicies: this.governance.count(),
    };
  }

  health(): GlobalCloudHealth {
    const metrics = this.metrics();

    return {
      success: true,
      system: "AVOS Enterprise Global Cloud & Multi-Region Platform",
      version: "1.0.0",
      status:
        metrics.failedDeployments > 0 || metrics.activeRegions === 0
          ? "DEGRADED"
          : "READY",
      metrics,
      components: {
        cloudRegionRegistry: "READY",
        deploymentOrchestrator: "READY",
        globalTrafficRouter: "READY",
        multiRegionFailover: "READY",
        configurationFederation: "READY",
        releaseChannelManager: "READY",
        cloudGovernance: "READY",
      },
    };
  }

  diagnostics() {
    return {
      success: true,
      health: this.health(),
      regions: this.regions.list(),
      deployments: this.deployments.list(),
      routes: this.routes.list(),
      configurations: this.configuration.list(),
      releaseChannels: this.releases.list(),
      governancePolicies: this.governance.list(),
    };
  }
}
