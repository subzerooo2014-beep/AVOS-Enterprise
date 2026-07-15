export interface IndustryVertical {
  key: string;
  name: string;
  capabilities: string[];
  active: boolean;
}

export interface IndustryListingRequest {
  vertical: string;
  sellerId: string;
  title: string;
  price: number;
  currency: string;
  attributes: Record<string, unknown>;
}

export interface IndustryListing {
  id: string;
  vertical: string;
  sellerId: string;
  title: string;
  price: number;
  currency: string;
  attributes: Record<string, unknown>;
  status: "DRAFT" | "PUBLISHED" | "SOLD" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}