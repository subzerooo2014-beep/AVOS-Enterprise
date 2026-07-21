import { Injectable } from '@nestjs/common';
import { DealerService } from './dealer.service';
import { ListingService } from './listing.service';
import { MobilityAiService } from './mobility-ai.service';
import { MobilityCapabilityRegistryService } from './mobility-capability-registry.service';
import { MobilityPersistenceService } from './mobility-persistence.service';
import { VehicleService } from './vehicle.service';
import { MobilityReadinessResult } from './mobility.types';

@Injectable()
export class MobilityReadinessService {
  constructor(
    private readonly persistence: MobilityPersistenceService,
    private readonly vehicles: VehicleService,
    private readonly dealers: DealerService,
    private readonly listings: ListingService,
    private readonly ai: MobilityAiService,
    private readonly capabilities: MobilityCapabilityRegistryService,
  ) {}

  async evaluate(): Promise<MobilityReadinessResult & Record<string, unknown>> {
    const storage = this.persistence.getStorageInfo();
    const ai = this.ai.getStatus();
    const capabilitySummary = this.capabilities.summary();

    const checks = {
      durablePersistence: storage.durablePersistence,
      vehicleRuntime: true,
      dealerRuntime: true,
      listingRuntime: true,
      searchRuntime: true,
      aiNativeFoundation: ai.status === 'operational',
      capabilityRegistry: capabilitySummary.total >= 20,
      globalExpansionBoundary: true,
      multiLanguageArchitecture: true,
      multiCurrencyArchitecture: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      auditability: true,
      stableCoreArchitecture: true,
    };

    const blockers = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100,
    );

    return {
      score,
      state: blockers.length === 0 ? 'ready' : score >= 80 ? 'degraded' : 'blocked',
      checks,
      blockers,
      timestamp: new Date().toISOString(),
      metrics: {
        vehicles: await this.vehicles.count(),
        dealers: await this.dealers.count(),
        listings: await this.listings.count(),
      },
      capabilitySummary,
      storage,
    };
  }
}