import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { randomUUID } from "node:crypto";
import {
  RuntimeEvent,
  RuntimeEventType,
  RuntimeAgent,
} from "./super-app-v2.types";

@Injectable()
export class SuperAppV2EventBusService {
  private readonly subject = new Subject<RuntimeEvent>();
  private readonly events: RuntimeEvent[] = [];

  publish(input: {
    workflowId: string;
    type: RuntimeEventType;
    message: string;
    agent?: RuntimeAgent;
    payload?: Record<string, unknown>;
  }): RuntimeEvent {
    const event: RuntimeEvent = {
      id: randomUUID(),
      workflowId: input.workflowId,
      type: input.type,
      message: input.message,
      agent: input.agent,
      payload: input.payload,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);
    this.subject.next(event);
    return event;
  }

  stream(workflowId?: string): Observable<RuntimeEvent> {
    if (!workflowId) {
      return this.subject.asObservable();
    }

    return this.subject.asObservable().pipe(
      filter((event) => event.workflowId === workflowId),
    );
  }

  list(workflowId?: string): RuntimeEvent[] {
    if (!workflowId) {
      return [...this.events];
    }

    return this.events.filter((event) => event.workflowId === workflowId);
  }
}