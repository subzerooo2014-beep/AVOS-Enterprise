import { Injectable } from '@nestjs/common';
import {
  MarketplaceDashboardSnapshot,
  VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES,
} from './vehicle-marketplace-operations.types';

@Injectable()
export class MarketplaceOperationsDashboardService {
  snapshot(input: Partial<MarketplaceDashboardSnapshot> = {}) {
    return {
      generatedAt: new Date().toISOString(),
      publishedListings: Math.max(
        0,
        Math.round(input.publishedListings ?? 0),
      ),
      activeInventory: Math.max(
        0,
        Math.round(input.activeInventory ?? 0),
      ),
      averagePriceConfidence: Math.max(
        0,
        Math.min(
          100,
          Math.round(input.averagePriceConfidence ?? 75),
        ),
      ),
      fraudRisk: Math.max(
        0,
        Math.min(100, Math.round(input.fraudRisk ?? 0)),
      ),
      conversionRate: Math.max(
        0,
        Math.min(100, Number(input.conversionRate ?? 0)),
      ),
      capabilityStatus: Object.fromEntries(
        VEHICLE_MARKETPLACE_OPERATIONS_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as MarketplaceDashboardSnapshot['capabilityStatus'],
    };
  }
}