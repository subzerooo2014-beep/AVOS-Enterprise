export interface AvosContext {
  source?: string;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}
