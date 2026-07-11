export interface AvosCommand<T = any> {
  type: string;
  source?: string;
  payload: T;
  metadata?: any;
  correlationId?: string;
}
