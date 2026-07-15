import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { CapabilityRegistryV2Service } from '../services/capability-registry-v2.service';
import { CapabilityDiscoveryService } from '../services/capability-discovery.service';
import { CapabilityActivationService } from '../services/capability-activation.service';
import { CapabilityPoliciesService } from '../services/capability-policies.service';
import { CapabilityMarketplaceService } from '../services/capability-marketplace.service';
import { CapabilityGraphService } from '../services/capability-graph.service';
import { CapabilityMetricsService } from '../services/capability-metrics.service';
import { CapabilityDependenciesService } from '../services/capability-dependencies.service';

@Controller('platform-os-v2/capabilities')
export class CapabilitiesPlatformController {
  constructor(
    private readonly capabilityRegistryV2: CapabilityRegistryV2Service,
    private readonly capabilityDiscovery: CapabilityDiscoveryService,
    private readonly capabilityActivation: CapabilityActivationService,
    private readonly capabilityPolicies: CapabilityPoliciesService,
    private readonly capabilityMarketplace: CapabilityMarketplaceService,
    private readonly capabilityGraph: CapabilityGraphService,
    private readonly capabilityMetrics: CapabilityMetricsService,
    private readonly capabilityDependencies: CapabilityDependenciesService,
  ) {}

  private services() {
    return {
      'capability-registry-v2': this.capabilityRegistryV2,
      'capability-discovery': this.capabilityDiscovery,
      'capability-activation': this.capabilityActivation,
      'capability-policies': this.capabilityPolicies,
      'capability-marketplace': this.capabilityMarketplace,
      'capability-graph': this.capabilityGraph,
      'capability-metrics': this.capabilityMetrics,
      'capability-dependencies': this.capabilityDependencies,
    };
  }

  @Get('capabilities')
  capabilities() {
    return Object.keys(this.services());
  }

  @Get('health')
  health() {
    return Object.values(this.services()).map(
      (service) => service.health(),
    );
  }

  @Post(':capability/execute')
  execute(
    @Param('capability') capability: string,
    @Body() input: PlatformOperationDto,
  ) {
    const service = this.services()[
      capability as keyof ReturnType<CapabilitiesPlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}