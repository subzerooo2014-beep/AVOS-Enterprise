export const SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES = [
  'service-catalog-engine',
  'workshop-provider-profile-engine',
  'service-booking-engine',
  'capacity-scheduling-engine',
  'service-pricing-quotation-engine',
  'parts-labor-coordination-engine',
  'provider-performance-engine',
  'service-quality-sla-engine',
  'customer-service-journey-engine',
  'service-payment-coordinator',
  'complaints-claims-engine',
  'service-fulfillment-orchestrator',
  'service-marketplace-dashboard',
] as const;

export type ServiceProviderMarketplaceCapability =
  (typeof SERVICE_PROVIDER_MARKETPLACE_CAPABILITIES)[number];

export interface ServiceCatalogItem {
  id: string;
  providerId: string;
  category: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  durationMinutes: number;
  active: boolean;
}

export interface ProviderProfile {
  id: string;
  name: string;
  type: 'workshop' | 'mobile-service' | 'inspection-center' | 'specialist';
  city: string;
  region: string;
  rating: number;
  verified: boolean;
  capabilities: string[];
}

export interface ServiceBooking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  vehicleId: string;
  scheduledAt: string;
  status: 'requested' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
}

export interface CapacitySlot {
  id: string;
  providerId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  booked: number;
}

export interface ServiceQuote {
  id: string;
  bookingId: string;
  partsCost: number;
  laborCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
}

export interface ProviderMetric {
  providerId: string;
  completedJobs: number;
  cancelledJobs: number;
  averageRating: number;
  onTimeRate: number;
  slaCompliance: number;
}

export interface ServiceComplaint {
  id: string;
  bookingId: string;
  customerId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'rejected';
}

export interface ServiceMarketplaceDashboardSnapshot {
  generatedAt: string;
  activeServices: number;
  verifiedProviders: number;
  confirmedBookings: number;
  averageSlaCompliance: number;
  openComplaints: number;
  capabilityStatus: Record<
    ServiceProviderMarketplaceCapability,
    'operational'
  >;
}