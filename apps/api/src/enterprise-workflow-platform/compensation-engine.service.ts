import { Injectable } from "@nestjs/common";
import { WorkflowEventsService } from "./workflow-events.service";
import { WorkflowStateStoreService } from "./workflow-state-store.service";

@Injectable()
export class CompensationEngineService {
  constructor(
    private readonly store: WorkflowStateStoreService,
    private readonly events: WorkflowEventsService,
  ) {}

  compensate(executionId: string) {
    const execution = this.store.get(executionId);
    execution.status = "COMPENSATING";

    for (const step of [...execution.steps].reverse()) {
      if (step.status === "COMPLETED") {
        step.status = "COMPENSATED";
      }
    }

    execution.status = "COMPENSATED";
    execution.completedAt = new Date().toISOString();

    const saved = this.store.save(execution);
    this.events.emit("WorkflowCompensated", executionId, {
      definitionId: execution.definitionId,
    });

    return saved;
  }
}
