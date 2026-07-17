import { Injectable } from '@nestjs/common';
import { RuntimeEvent } from '../contracts/runtime.contracts';
import { RuntimeEventBusService } from './runtime-event-bus.service';
import { RuntimeEventStoreService } from './runtime-event-store.service';

@Injectable()
export class RuntimeEventReplayService {
  constructor(
    private readonly store: RuntimeEventStoreService,
    private readonly bus: RuntimeEventBusService,
  ) {}

  replay(type?: string): RuntimeEvent[] {
    const events = this.store.list(type);

    for (const event of events) {
      this.bus.publish({
        type: `${event.type}.replayed`,
        source: 'runtime-event-replay',
        correlationId: event.correlationId,
        causationId: event.id,
        payload: event.payload,
        metadata: {
          originalEventId: event.id,
        },
      });
    }

    return events;
  }
}