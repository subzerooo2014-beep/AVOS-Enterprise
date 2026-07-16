import { Injectable } from "@nestjs/common";
import { UnitOfWorkService } from "../unit-of-work/unit-of-work.service";
import { ConcurrencyManagerService } from "./concurrency-manager.service";
import { PersistenceEventsService } from "./persistence-events.service";
import { PersistenceMetricsService } from "./persistence-metrics.service";
import { RetryPolicyService } from "./retry-policy.service";
import type { UnitOfWorkTransactionClient } from "../unit-of-work/unit-of-work.types";

@Injectable()
export class DistributedTransactionCoordinatorService {
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly concurrency: ConcurrencyManagerService,
    private readonly retryPolicy: RetryPolicyService,
    private readonly events: PersistenceEventsService,
    private readonly metrics: PersistenceMetricsService,
  ) {}

  async coordinate<T>(
    name: string,
    lockKey: string,
    handler: (tx: UnitOfWorkTransactionClient) => Promise<T>,
    maxAttempts = 3,
  ): Promise<T> {
    const operation = this.metrics.begin(name, lockKey);

    try {
      const execution = await this.retryPolicy.execute(
        async () =>
          this.concurrency.runExclusive(lockKey, async () =>
            this.unitOfWork.execute(handler),
          ),
        maxAttempts,
      );

      if (execution.attempts > 1) {
        for (let attempt = 1; attempt < execution.attempts; attempt += 1) {
          this.metrics.retry(operation.id);
        }
      }

      this.metrics.complete(operation.id);
      this.events.emit(
        "PersistenceTransactionCompleted",
        "PersistenceRuntime",
        {
          name,
          lockKey,
          attempts: execution.attempts,
        },
      );

      return execution.result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.metrics.fail(operation.id, message);
      this.events.emit(
        "PersistenceTransactionFailed",
        "PersistenceRuntime",
        {
          name,
          lockKey,
          error: message,
        },
      );
      throw error;
    }
  }
}
