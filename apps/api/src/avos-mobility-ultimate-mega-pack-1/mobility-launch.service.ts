import { Injectable } from '@nestjs/common';
import { MobilityCapabilityRegistryService } from './mobility-capability-registry.service';
import { MobilityGlobalizationService } from './mobility-globalization.service';
import { MobilityReadinessService } from './mobility-readiness.service';

@Injectable()
export class MobilityLaunchService {
  constructor(
    private readonly readiness: MobilityReadinessService,
    private readonly capabilities: MobilityCapabilityRegistryService,
    private readonly globalization: MobilityGlobalizationService,
  ) {}

  async status() {
    const readiness = await this.readiness.evaluate();
    return {
      name: 'AVOS Mobility — Ultimate Mega Pack 1',
      version: 'MOB-UMP1-1.0.0',
      status: readiness.state === 'ready' ? 'operational' : readiness.state,
      purpose: 'Enterprise production launch with stable expansion boundaries',
      productionLaunch: true,
      foundationRebuild: false,
      foundationIntegration: {
        foundationFirst: true,
        capabilityFirst: true,
        blueprintDriven: true,
        humanFinalAuthority: true,
        globalComplianceReadinessGate: true,
        knowledgeFabricReady: true,
        intelligenceFabricReady: true,
        capabilityFabricReady: true,
        livingVisionReady: true,
      },
      capabilities: this.capabilities.summary(),
      defaultMarket: this.globalization.resolve(),
      readiness,
      nextExpansionDomains: [
        'payments',
        'financing',
        'insurance',
        'auctions',
        'fleet',
        'rental',
        'inspection',
        'logistics',
        'government integrations',
      ],
    };
  }
}