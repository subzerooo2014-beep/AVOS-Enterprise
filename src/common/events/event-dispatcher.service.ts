import { Injectable } from "@nestjs/common";

@Injectable()
export class EventDispatcherService {
  dispatch(event: string, payload: unknown) {
    return {
      event,
      payload,
      dispatchedAt: new Date().toISOString(),
    };
  }
}
