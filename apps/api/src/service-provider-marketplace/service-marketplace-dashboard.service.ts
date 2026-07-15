import { Injectable } from '@nestjs/common';
import {
  SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES,
  ServiceMarketplaceDashboardSnapshot,
} from './service-provider-marketplace.types';

@Injectable()
export class ServiceMarketplaceDashboardService {
  snapshot(
    input: Partial<ServiceMarketplaceDashboardSnapshot> = {},
  ): ServiceMarketplaceDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      activeServices: Math.max(
        0,
        Math.round(input.activeServices ?? 0),
      ),
      verifiedProviders: Math.max(
        0,
        Math.round(input.verifiedProviders ?? 0),
      ),
      confirmedBookings: Math.max(
        0,
        Math.round(input.confirmedBookings ?? 0),
      ),
      averageSlaCompliance: Math.max(
        0,
        Math.min(
          100,
          Math.round(input.averageSlaCompliance ?? 0),
        ),
      ),
      openComplaints: Math.max(
        0,
        Math.round(input.openComplaints ?? 0),
      ),
      capabilityStatus: Object.fromEntries(
        SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as ServiceMarketplaceDashboardSnapshot['capabilityStatus'],
    };
  }
}