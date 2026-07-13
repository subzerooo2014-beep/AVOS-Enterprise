import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowStateMachine {
  private readonly initial = "CREATED";
  private readonly completed = "COMPLETED";
  private readonly failed = "FAILED";

  initialState(): string {
    return this.initial;
  }

  completeState(): string {
    return this.completed;
  }

  failedState(): string {
    return this.failed;
  }

  transition(current: string, action: string): string {
    switch (action) {
      case "START":
        return "RUNNING";

      case "COMPLETE":
        return this.completed;

      case "FAIL":
        return this.failed;

      case "RETRY":
        return "RETRYING";

      case "CANCEL":
        return "CANCELLED";

      default:
        return current;
    }
  }

  isTerminal(state: string): boolean {
    return ["COMPLETED", "FAILED", "CANCELLED"].includes(state);
  }
}
