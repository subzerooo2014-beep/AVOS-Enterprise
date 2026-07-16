import { Injectable, NotFoundException } from "@nestjs/common";
import type { AutonomousOperationRecord } from "./enterprise-intelligence-command.types";

@Injectable()
export class AutonomousOperationsService {
  private readonly operations = new Map<string, AutonomousOperationRecord>();

  plan(
    name: string,
    type: string,
    priority: number,
    steps: string[],
    context: Record<string, unknown> = {},
  ): AutonomousOperationRecord {
    const now = new Date().toISOString();

    const operation: AutonomousOperationRecord = {
      id: `autonomous-operation-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      name,
      type,
      status: "PLANNED",
      priority,
      context: { ...context },
      steps: [...steps],
      currentStep: steps[0],
      createdAt: now,
      updatedAt: now,
    };

    this.operations.set(operation.id, operation);
    return this.clone(operation);
  }

  start(id: string): AutonomousOperationRecord {
    const operation = this.requireOperation(id);
    operation.status = "RUNNING";
    operation.updatedAt = new Date().toISOString();
    return this.clone(operation);
  }

  advance(id: string): AutonomousOperationRecord {
    const operation = this.requireOperation(id);
    const index = operation.currentStep
      ? operation.steps.indexOf(operation.currentStep)
      : -1;
    const nextStep = operation.steps[index + 1];

    if (!nextStep) {
      operation.status = "COMPLETED";
      operation.currentStep = undefined;
      operation.completedAt = new Date().toISOString();
    } else {
      operation.status = "RUNNING";
      operation.currentStep = nextStep;
    }

    operation.updatedAt = new Date().toISOString();
    return this.clone(operation);
  }

  fail(id: string, error: string): AutonomousOperationRecord {
    const operation = this.requireOperation(id);
    operation.status = "FAILED";
    operation.error = error;
    operation.updatedAt = new Date().toISOString();
    return this.clone(operation);
  }

  list(): AutonomousOperationRecord[] {
    return Array.from(this.operations.values())
      .map((item) => this.clone(item))
      .sort((a, b) => b.priority - a.priority);
  }

  count(): number {
    return this.operations.size;
  }

  runningCount(): number {
    return this.list().filter((item) => item.status === "RUNNING").length;
  }

  failedCount(): number {
    return this.list().filter((item) => item.status === "FAILED").length;
  }

  private requireOperation(id: string): AutonomousOperationRecord {
    const operation = this.operations.get(id);

    if (!operation) {
      throw new NotFoundException(
        `Autonomous operation '${id}' was not found.`,
      );
    }

    return operation;
  }

  private clone(item: AutonomousOperationRecord): AutonomousOperationRecord {
    return {
      ...item,
      context: { ...item.context },
      steps: [...item.steps],
    };
  }
}
