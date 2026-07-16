import { Injectable } from "@nestjs/common";
import {
  NervousWorkflowExecutionStatus,
  NervousWorkflowStateTransition
} from "../enterprise-nervous-system-mega-pack-3.types";

@Injectable()
export class NervousWorkflowStateService {
  private readonly transitions =
    new Map<string, NervousWorkflowStateTransition>();

  transition(input: {
    executionId: string;
    fromStatus: NervousWorkflowExecutionStatus;
    toStatus: NervousWorkflowExecutionStatus;
    reason: string;
    actorIdentityId: string;
  }) {
    const allowed = this.allowedTransitions()[input.fromStatus];

    if (!allowed.includes(input.toStatus)) {
      throw new Error(
        `Invalid workflow transition: ${input.fromStatus} -> ${input.toStatus}`
      );
    }

    const transition: NervousWorkflowStateTransition = {
      id: `workflow-transition:${Date.now()}:${this.transitions.size + 1}`,
      executionId: input.executionId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      reason: input.reason,
      actorIdentityId: input.actorIdentityId,
      occurredAt: new Date().toISOString()
    };

    this.transitions.set(transition.id, transition);
    return transition;
  }

  list() {
    return Array.from(this.transitions.values());
  }

  summary() {
    return {
      total: this.transitions.size,
      failures:
        this.list().filter((x) => x.toStatus === "failed").length,
      completed:
        this.list().filter((x) => x.toStatus === "completed").length
    };
  }

  private allowedTransitions(): Record<
    NervousWorkflowExecutionStatus,
    NervousWorkflowExecutionStatus[]
  > {
    return {
      created: ["running", "cancelled"],
      running: [
        "waiting-human-approval",
        "compensating",
        "completed",
        "failed",
        "cancelled"
      ],
      "waiting-human-approval": [
        "running",
        "failed",
        "cancelled"
      ],
      compensating: ["completed", "failed"],
      completed: [],
      failed: ["compensating"],
      cancelled: []
    };
  }
}
