import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CloudDeploymentOrchestratorService } from "./cloud-deployment-orchestrator.service";
import { CloudGovernanceService } from "./cloud-governance.service";
import { CloudRegionRegistryService } from "./cloud-region-registry.service";
import { EnterpriseGlobalCloudPlatformService } from "./enterprise-global-cloud-platform.service";
import { GlobalConfigurationFederationService } from "./global-configuration-federation.service";
import { GlobalTrafficRouterService } from "./global-traffic-router.service";
import { ReleaseChannelManagerService } from "./release-channel-manager.service";
import type {
  CloudGovernancePolicyRecord,
  CloudRegionRecord,
  ReleaseChannelRecord,
} from "./enterprise-global-cloud.types";

@Controller("enterprise-global-cloud-platform")
export class EnterpriseGlobalCloudPlatformController {
  constructor(
    private readonly platform: EnterpriseGlobalCloudPlatformService,
    private readonly regions: CloudRegionRegistryService,
    private readonly deployments: CloudDeploymentOrchestratorService,
    private readonly routes: GlobalTrafficRouterService,
    private readonly configuration: GlobalConfigurationFederationService,
    private readonly releases: ReleaseChannelManagerService,
    private readonly governance: CloudGovernanceService,
  ) {}

  @Get("status")
  status() {
    return this.platform.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("regions")
  registerRegion(
    @Body() body: Omit<CloudRegionRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, region: this.regions.register(body) };
  }

  @Post("deployments")
  planDeployment(
    @Body()
    body: {
      application: string;
      version: string;
      regionId: string;
      configuration?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      deployment: this.deployments.plan(
        body.application,
        body.version,
        body.regionId,
        body.configuration,
      ),
    };
  }

  @Post("deployments/:id/deploy")
  deploy(@Param("id") id: string) {
    return { success: true, deployment: this.deployments.deploy(id) };
  }

  @Post("deployments/:id/fail")
  failDeployment(
    @Param("id") id: string,
    @Body() body: { error: string },
  ) {
    return {
      success: true,
      deployment: this.deployments.fail(id, body.error),
    };
  }

  @Post("routes")
  registerRoute(
    @Body()
    body: {
      service: string;
      regionId: string;
      weight: number;
      enabled?: boolean;
    },
  ) {
    return {
      success: true,
      route: this.routes.register(
        body.service,
        body.regionId,
        body.weight,
        body.enabled,
      ),
    };
  }

  @Post("configuration")
  setConfiguration(
    @Body()
    body: {
      namespace: string;
      key: string;
      value: unknown;
      regionOverrides?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      configuration: this.configuration.set(
        body.namespace,
        body.key,
        body.value,
        body.regionOverrides,
      ),
    };
  }

  @Post("release-channels")
  registerReleaseChannel(
    @Body() body: Omit<ReleaseChannelRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, channel: this.releases.register(body) };
  }

  @Post("governance-policies")
  registerGovernancePolicy(
    @Body()
    body: Omit<CloudGovernancePolicyRecord, "createdAt" | "updatedAt">,
  ) {
    return { success: true, policy: this.governance.register(body) };
  }
}
