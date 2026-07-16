export interface G9MarketplaceListing {
  id: string;
  listingType: string;
  ownerId: string;
  active: boolean;
  metadata?: Record<string, unknown>;
}