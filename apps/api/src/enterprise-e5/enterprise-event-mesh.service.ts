import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { EnterpriseEvent } from "./enterprise-e5.types";

@Injectable()
export class EnterpriseEventMeshService {
  private readonly events: EnterpriseEvent[] = [];

  publish(
    type: string,
    payload: Record<string, unknown> = {},
    source = "enterprise-e5",
  ): EnterpriseEvent {
    const event: EnterpriseEvent = {
      id: randomUUID(),
      type,
      source,
      payload,
      publishedAt: new Date().toISOString(),
    };

    this.events.push(event);
    return event;
  }

  list(): EnterpriseEvent[] {
    return [...this.events];
  }

  count(): number {
    return this.events.length;
  }
}