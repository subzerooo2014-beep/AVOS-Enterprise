import { Injectable } from '@nestjs/common';
import { ShipmentTrackingEvent } from './auction-export-logistics.types';

@Injectable()
export class PortDestinationTrackingEngineService {
  timeline(events: ShipmentTrackingEvent[]) {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() -
        new Date(b.occurredAt).getTime(),
    );

    return {
      events: sorted,
      latest: sorted.at(-1) ?? null,
      completed: sorted.some(
        (event) => event.status === 'delivered',
      ),
    };
  }
}