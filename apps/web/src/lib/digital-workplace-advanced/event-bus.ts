export type WorkplaceEvent = {
  topic: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: string;
};

type Listener = (event: WorkplaceEvent) => void;

class WorkplaceEventBus {
  private listeners = new Map<string, Set<Listener>>();

  subscribe(topic: string, listener: Listener): () => void {
    const listeners = this.listeners.get(topic) ?? new Set<Listener>();
    listeners.add(listener);
    this.listeners.set(topic, listeners);
    return () => listeners.delete(listener);
  }

  publish(event: WorkplaceEvent): void {
    this.listeners.get(event.topic)?.forEach((listener) => listener(event));
    this.listeners.get('*')?.forEach((listener) => listener(event));
  }
}

export const workplaceEventBus = new WorkplaceEventBus();