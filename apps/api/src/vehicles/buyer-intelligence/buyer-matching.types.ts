export interface BuyerMatchingInput {
  buyerId: string;
  budgetMin: number;
  budgetMax: number;
  preferredBrands: string[];
  preferredBodyTypes: string[];
  preferredFuelTypes: string[];
  location?: string;
}

export interface BuyerMatchingVehicle {
  vehicleId: string;
  price: number;
  brand: string;
  bodyType: string;
  fuelType: string;
  qualityScore: number;
  trustScore: number;
}

export interface BuyerMatchingResult {
  buyerId: string;
  vehicleId: string;
  matchScore: number;
  reasons: string[];
}
