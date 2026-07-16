import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowTimeoutManagerService {
  private readonly deadlines = new Map<string, number>();

  schedule(workflowExecutionId: string, timeoutMs: number): void {
    this.deadlines.set(workflowExecutionId, Date.now() + timeoutMs);
  }

  cancel(workflowExecutionId: string): void {
    this.deadlines.delete(workflowExecutionId);
  }

  isTimedOut(workflowExecutionId: string): boolean {
    const deadline = this.deadlines.get(workflowExecutionId);
    return deadline !== undefined && deadline <= Date.now();
  }

  list() {
    return Array.from(this.deadlines.entries()).map(([workflowExecutionId, deadline]) => ({
      workflowExecutionId,
      deadline: new Date(deadline).toISOString(),
      timedOut: deadline <= Date.now(),
    }));
  }
}
