import { Injectable } from "@nestjs/common";
import type {
  PersistenceOperation,
  PersistenceRuntimeMetrics,
} from "./persistence-runtime.types";

@Injectable()
export class PersistenceMetricsService {
  private readonly operations: PersistenceOperation[] = [];

  begin(
    name: string,
    repository?: string,
    metadata?: Record<string, unknown>,
  ): PersistenceOperation {
    const operation: PersistenceOperation = {
      id: `po-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name,
      repository,
      status: "RUNNING",
      attempts: 1,
      startedAt: new Date().toISOString(),
      metadata,
    };

    this.operations.unshift(operation);
    this.trim();
    return { ...operation };
  }

  retry(id: string): void {
    const operation = this.operations.find((item) => item.id === id);

    if (operation) {
      operation.status = "RETRYING";
      operation.attempts += 1;
    }
  }

  complete(id: string): void {
    const operation = this.operations.find((item) => item.id === id);

    if (!operation) {
      return;
    }

    const completedAt = new Date();
    operation.status = "COMPLETED";
    operation.completedAt = completedAt.toISOString();
    operation.durationMs =
      completedAt.getTime() - new Date(operation.startedAt).getTime();
  }

  fail(id: string, error: string): void {
    const operation = this.operations.find((item) => item.id === id);

    if (!operation) {
      return;
    }

    const completedAt = new Date();
    operation.status = "FAILED";
    operation.error = error;
    operation.completedAt = completedAt.toISOString();
    operation.durationMs =
      completedAt.getTime() - new Date(operation.startedAt).getTime();
  }

  list(limit = 100): PersistenceOperation[] {
    return this.operations
      .slice(0, Math.max(1, Math.min(limit, 500)))
      .map((operation) => ({
        ...operation,
        metadata: operation.metadata ? { ...operation.metadata } : undefined,
      }));
  }

  metrics(cacheEntries: number, emittedEvents: number): PersistenceRuntimeMetrics {
    const completed = this.operations.filter(
      (item) => item.status === "COMPLETED",
    );
    const durations = completed
      .map((item) => item.durationMs ?? 0)
      .filter((duration) => duration >= 0);

    return {
      totalOperations: this.operations.length,
      completedOperations: completed.length,
      failedOperations: this.operations.filter(
        (item) => item.status === "FAILED",
      ).length,
      retriedOperations: this.operations.filter((item) => item.attempts > 1)
        .length,
      activeOperations: this.operations.filter(
        (item) => item.status === "RUNNING" || item.status === "RETRYING",
      ).length,
      cacheEntries,
      emittedEvents,
      averageDurationMs:
        durations.length === 0
          ? 0
          : Math.round(
              durations.reduce((total, duration) => total + duration, 0) /
                durations.length,
            ),
    };
  }

  private trim(): void {
    if (this.operations.length > 500) {
      this.operations.length = 500;
    }
  }
}
