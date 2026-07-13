import { Injectable } from "@nestjs/common";

@Injectable()
export class EventDispatcher {
  dispatch(event: any) {
    return {
      dispatched: true,
      eventId: `event-${Date.now()}`,
      event,
    };
  }
}
