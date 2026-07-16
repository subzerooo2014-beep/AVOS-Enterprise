import { Injectable } from "@nestjs/common";
import type { WorkflowEvent } from "./enterprise-workflow.types";

@Injectable()
export class WorkflowEventsService {
  private readonly events: WorkflowEvent[] = [];

  emit(
    type: string,
    workflowExecutionId: string,
    payload: Record<string, unknown> = {},
  ): WorkflowEvent {
    const event: WorkflowEvent = {
      id: `wf-event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      type,
      workflowExecutionId,
      payload,
      occurredAt: new Date().toISOString(),
    };

    this.events.unshift(event);
    if (this.events.length > 1000) this.events.length = 1000;

    return { ...event, payload: { ...event.payload } };
  }

  list(workflowExecutionId?: string): WorkflowEvent[] {
    return this.events
      .filter((item) =>
        workflowExecutionId ? item.workflowExecutionId === workflowExecutionId : true,
      )
      .map((item) => ({ ...item, payload: { ...item.payload } }));
  }

  count(): number {
    return this.events.length;
  }
}
