import { AvosLogger } from "../../foundation/logger/avos-logger";
import { AvosError } from "../../foundation/errors/avos-error";
import { AvosEvent } from "./event";
import { AvosEventHandler } from "./event-handler";

export class AvosEventBus {
  private readonly handlers: AvosEventHandler[] = [];
  private readonly logger = new AvosLogger("EventBus");

  register(handler: AvosEventHandler) {
    this.handlers.push(handler);
  }

  async publish(event: AvosEvent) {
    if (!event.type) {
      throw new AvosError("Event type is required", "EVENT_TYPE_REQUIRED");
    }

    const handlers = this.handlers.filter((handler) => handler.supports(event));

    if (handlers.length === 0) {
      this.logger.warn("No Event Handlers", event.type);

      return {
        status: "skipped",
        reason: "NO_HANDLER",
        eventType: event.type,
      };
    }

    for (const handler of handlers) {
      await handler.handle(event);
    }

    return {
      status: "success",
      handlers: handlers.length,
      eventType: event.type,
    };
  }
}
