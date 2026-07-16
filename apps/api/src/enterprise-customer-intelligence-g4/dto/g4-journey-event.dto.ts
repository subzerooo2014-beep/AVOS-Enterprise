export class CreateG4JourneyEventDto {
  id!: string;
  customerId!: string;
  eventType!: string;
  occurredAt!: string;
  metadata?: Record<string, unknown>;
}

export class UpdateG4JourneyEventDto {
  id?: string;
  customerId?: string;
  eventType?: string;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
}