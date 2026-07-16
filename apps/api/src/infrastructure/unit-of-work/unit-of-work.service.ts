import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { TransactionManagerService } from "../transactions/transaction-manager.service";
import { UnitOfWorkContext } from "./unit-of-work.context";
import { UnitOfWorkRegistry } from "./unit-of-work.registry";
import type {
  UnitOfWorkExecution,
  UnitOfWorkOptions,
  UnitOfWorkTransactionClient,
} from "./unit-of-work.types";

@Injectable()
export class UnitOfWorkService {
  constructor(
    private readonly transactionManager: TransactionManagerService,
    private readonly context: UnitOfWorkContext,
    private readonly registry: UnitOfWorkRegistry,
  ) {}

  async execute<T>(
    handler: (tx: UnitOfWorkTransactionClient) => Promise<T>,
    options?: UnitOfWorkOptions,
  ): Promise<T> {
    const id = `uow-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const startedAtDate = new Date();
    this.registry.started();

    try {
      const result = await this.transactionManager.run<T>(async (tx: Prisma.TransactionClient) => {
        this.context.setTransactionClient(tx);

        try {
          return await handler(tx);
        } finally {
          this.context.clear();
        }
      }, options);

      this.registry.completed(
        this.createExecution(id, startedAtDate, true, result),
      );

      return result;
    } catch (error) {
      this.context.clear();

      this.registry.completed(
        this.createExecution(
          id,
          startedAtDate,
          false,
          undefined,
          error instanceof Error ? error.message : String(error),
        ),
      );

      throw error;
    }
  }

  hasActiveTransaction(): boolean {
    return this.context.hasTransaction();
  }

  currentTransaction(): UnitOfWorkTransactionClient {
    return this.context.getTransactionClient();
  }

  status() {
    const snapshot = this.registry.snapshot();

    return {
      success: true,
      system: "AVOS Enterprise Unit Of Work",
      version: "1.0.0",
      status: "READY",
      ...snapshot,
    };
  }

  private createExecution<T>(
    id: string,
    startedAt: Date,
    success: boolean,
    result?: T,
    error?: string,
  ): UnitOfWorkExecution<T> {
    const completedAt = new Date();

    return {
      id,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMs: completedAt.getTime() - startedAt.getTime(),
      success,
      result,
      error,
    };
  }
}
