import type { UnitOfWorkTransactionClient } from "./unit-of-work.types";

export class UnitOfWorkContext {
  private transactionClient?: UnitOfWorkTransactionClient;

  setTransactionClient(client: UnitOfWorkTransactionClient): void {
    this.transactionClient = client;
  }

  clear(): void {
    this.transactionClient = undefined;
  }

  hasTransaction(): boolean {
    return this.transactionClient !== undefined;
  }

  getTransactionClient(): UnitOfWorkTransactionClient {
    if (!this.transactionClient) {
      throw new Error("No active Unit Of Work transaction is available.");
    }

    return this.transactionClient;
  }
}
