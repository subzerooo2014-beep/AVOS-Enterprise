import { Injectable } from "@nestjs/common";
import type { UnitOfWorkExecution } from "./unit-of-work.types";

@Injectable()
export class UnitOfWorkRegistry {
  private readonly executions: UnitOfWorkExecution<unknown>[] = [];
  private activeExecutions = 0;

  started(): void {
    this.activeExecutions += 1;
  }

  completed(execution: UnitOfWorkExecution<unknown>): void {
    this.activeExecutions = Math.max(0, this.activeExecutions - 1);
    this.executions.unshift(execution);

    if (this.executions.length > 100) {
      this.executions.length = 100;
    }
  }

  snapshot() {
    const failedExecutions = this.executions.filter((item) => !item.success).length;

    return {
      activeExecutions: this.activeExecutions,
      completedExecutions: this.executions.length,
      failedExecutions,
      recentExecutions: this.executions.slice(0, 20),
    };
  }
}
