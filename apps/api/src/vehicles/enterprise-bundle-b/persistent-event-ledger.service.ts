import { Injectable } from "@nestjs/common";

@Injectable()
export class PersistentEventLedgerService {
  private readonly entries: Array<Record<string, unknown>> = [];

  append(entry: Record<string, unknown>) {
    const record = {
      id: `ledger-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...entry,
    };

    this.entries.push(record);
    return record;
  }

  list() {
    return [...this.entries].reverse();
  }
}
