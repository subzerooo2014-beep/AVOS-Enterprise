export const AUCTION_EXPORT_LOGISTICS_CAPABILITIES = [
  'auction-lifecycle-engine',
  'live-bidding-engine',
  'reserve-price-validation-engine',
  'auction-participant-operations',
  'export-eligibility-engine',
  'shipping-quotation-engine',
  'carrier-coordination-engine',
  'customs-documentation-engine',
  'port-destination-tracking-engine',
  'vehicle-handover-workflow',
  'export-payment-settlement-engine',
  'auction-export-orchestrator',
  'auction-export-dashboard',
] as const;

export type AuctionExportLogisticsCapability =
  (typeof AUCTION_EXPORT_LOGISTICS_CAPABILITIES)[number];

export type AuctionStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'ended'
  | 'settled'
  | 'cancelled';

export interface Auction {
  id: string;
  listingId: string;
  sellerId: string;
  startPrice: number;
  reservePrice: number;
  currency: string;
  startsAt: string;
  endsAt: string;
  status: AuctionStatus;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  currency: string;
  placedAt: string;
  valid: boolean;
}

export interface ExportAssessment {
  listingId: string;
  destinationCountry: string;
  vehicleAge: number;
  titleClear: boolean;
  inspectionPassed: boolean;
  sanctionsCleared: boolean;
  eligible: boolean;
  reasons: string[];
}

export interface ShippingQuote {
  id: string;
  carrierId: string;
  listingId: string;
  originPort: string;
  destinationPort: string;
  mode: 'container' | 'roro' | 'air';
  freightAmount: number;
  insuranceAmount: number;
  handlingAmount: number;
  currency: string;
  transitDays: number;
}

export interface CustomsDocument {
  id: string;
  listingId: string;
  type: string;
  number: string;
  issuedAt: string;
  expiresAt?: string;
  verified: boolean;
}

export interface ShipmentTrackingEvent {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  occurredAt: string;
  notes?: string;
}

export interface HandoverRecord {
  id: string;
  listingId: string;
  sellerId: string;
  carrierId: string;
  handedOverAt: string;
  conditionAccepted: boolean;
  documentsAccepted: boolean;
}

export interface AuctionExportDashboardSnapshot {
  generatedAt: string;
  liveAuctions: number;
  validBids: number;
  exportEligibleVehicles: number;
  activeShipments: number;
  settlementRate: number;
  capabilityStatus: Record<
    AuctionExportLogisticsCapability,
    'operational'
  >;
}