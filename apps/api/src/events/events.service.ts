import { Injectable, NotFoundException } from "@nestjs/common";
import type { CoreFlowEvent } from "../core-application-flows/core-flow.types";
import { requireText } from "../core-application-flows/core-flow.utils";

@Injectable()
export class EventsService {
  private readonly events: CoreFlowEvent[] = [];

  findAll(query: any = {}) {
    return this.events
      .filter((event) => !query.type || event.type === query.type)
      .filter(
        (event) =>
          !query.aggregateId || event.aggregateId === query.aggregateId,
      )
      .slice()
      .reverse();
  }

  findOne(id: string) {
    const event = this.events.find((item) => item.id === id);
    if (!event) throw new NotFoundException("Event not found");
    return event;
  }

  create(dto: any) {
    const event: CoreFlowEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: requireText(dto?.type, "type"),
      aggregateType: requireText(dto?.aggregateType, "aggregateType"),
      aggregateId: requireText(dto?.aggregateId, "aggregateId"),
      payload: dto?.payload ?? {},
      occurredAt: new Date().toISOString(),
    };
    this.events.push(event);
    return event;
  }

  remove(id: string) {
    const index = this.events.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException("Event not found");
    const [removed] = this.events.splice(index, 1);
    return { deleted: true, event: removed };
  }
}
