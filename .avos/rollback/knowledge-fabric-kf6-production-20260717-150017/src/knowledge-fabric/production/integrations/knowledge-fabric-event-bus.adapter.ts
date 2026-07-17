import { Injectable, Logger, Optional } from "@nestjs/common";

interface EventPublisher {
  publish?: (event: unknown) => Promise<unknown> | unknown;
  emit?: (name: string, payload: unknown) => Promise<unknown> | unknown;
}

@Injectable()
export class KnowledgeFabricEventBusAdapter {
  private readonly logger = new Logger(KnowledgeFabricEventBusAdapter.name);
  private emittedEvents = 0;

  constructor(
    @Optional()
    private readonly publisher?: EventPublisher,
  ) {}

  async publish(
    name: string,
    payload: Readonly<Record<string, unknown>>,
  ): Promise<void> {
    const event = {
      id: `knowledge-event:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
      name,
      source: "knowledge-fabric-production",
      occurredAt: new Date().toISOString(),
      payload,
    };

    try {
      if (this.publisher?.publish) {
        await this.publisher.publish(event);
      } else if (this.publisher?.emit) {
        await this.publisher.emit(name, event);
      } else {
        this.logger.debug(`Event publisher unavailable; retained local event ${name}.`);
      }
      this.emittedEvents += 1;
    } catch (error) {
      this.logger.error(
        `Failed to publish ${name}.`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  count(): number {
    return this.emittedEvents;
  }
}