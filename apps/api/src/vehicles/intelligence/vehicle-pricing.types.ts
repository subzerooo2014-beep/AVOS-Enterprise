export interface VehiclePricingResult {
  estimatedPrice: number;
  minimumPrice: number;
  maximumPrice: number;
  currency: string;
  confidence: number;
  factors: string[];
}
