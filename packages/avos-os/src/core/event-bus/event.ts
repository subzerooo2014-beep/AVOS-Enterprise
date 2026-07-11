export interface AvosEvent<T = any> {
  type: string;
  payload?: T;
  source?: string;
  entityType?: string;
  entityId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}
