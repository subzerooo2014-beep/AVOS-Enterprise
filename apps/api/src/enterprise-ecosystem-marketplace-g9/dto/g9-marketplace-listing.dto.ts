export class CreateG9MarketplaceListingDto {
  id!: string;
  listingType!: string;
  ownerId!: string;
  active!: boolean;
  metadata?: Record<string, unknown>;
}

export class UpdateG9MarketplaceListingDto {
  id?: string;
  listingType?: string;
  ownerId?: string;
  active?: boolean;
  metadata?: Record<string, unknown>;
}