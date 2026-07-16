import { Injectable } from "@nestjs/common";
import { WorkflowEventsService } from "./workflow-events.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";

@Injectable()
export class WorkflowReplayService {
  constructor(
    private readonly store: WorkflowStateStoreService,
    private readonly events: WorkflowEventsService,
  ) {}

  replay(executionId: string) {
    const execution = this.store.get(executionId);
    const eventHistory = this.events.list(executionId);

    return {
      success: true,
      execution,
      eventHistory,
      replayedAt: new Date().toISOString(),
      replayStatus: "RECONSTRUCTED",
    };
  }
}
