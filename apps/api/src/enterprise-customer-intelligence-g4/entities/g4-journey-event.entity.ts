export interface G4JourneyEvent {
  id: string;
  customerId: string;
  eventType: string;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}