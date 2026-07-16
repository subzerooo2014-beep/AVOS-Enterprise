export interface G4CustomerProfile {
  id: string;
  customerId: string;
  segment: string;
  lifetimeValue?: number;
  traits?: Record<string, unknown>;
}