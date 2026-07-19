export interface FactoryEvent<TPayload = Record<string, unknown>> {
  id: string;
  type: string;
  source: string;
  subject?: string;
  payload: TPayload;
  metadata: Record<string, unknown>;
  occurredAt: string;
}

export type FactoryEventHandler<TPayload = Record<string, unknown>> = (
  event: FactoryEvent<TPayload>,
) => Promise<void> | void;
