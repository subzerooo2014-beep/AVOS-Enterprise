import { Injectable } from '@nestjs/common';
import {
  AUCTION_EXPORT_LOGISTICS_CAPABILITIES,
  AuctionExportDashboardSnapshot,
} from './auction-export-logistics.types';

@Injectable()
export class AuctionExportDashboardService {
  snapshot(
    input: Partial<AuctionExportDashboardSnapshot> = {},
  ): AuctionExportDashboardSnapshot {
    return {
      generatedAt: new Date().toISOString(),
      liveAuctions: Math.max(
        0,
        Math.round(input.liveAuctions ?? 0),
      ),
      validBids: Math.max(
        0,
        Math.round(input.validBids ?? 0),
      ),
      exportEligibleVehicles: Math.max(
        0,
        Math.round(input.exportEligibleVehicles ?? 0),
      ),
      activeShipments: Math.max(
        0,
        Math.round(input.activeShipments ?? 0),
      ),
      settlementRate: Math.max(
        0,
        Math.min(100, Number(input.settlementRate ?? 0)),
      ),
      capabilityStatus: Object.fromEntries(
        AUCTION_EXPORT_LOGISTICS_CAPABILITIES.map(
          (capability) => [capability, 'operational'],
        ),
      ) as AuctionExportDashboardSnapshot['capabilityStatus'],
    };
  }
}