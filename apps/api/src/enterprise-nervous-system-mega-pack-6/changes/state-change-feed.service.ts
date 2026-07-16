import { Injectable } from "@nestjs/common";
import { StateChangeRecord } from "../enterprise-nervous-system-mega-pack-6.types";

@Injectable()
export class StateChangeFeedService {
  private readonly records: StateChangeRecord[] = [];

  record(input: Omit<StateChangeRecord, "id" | "createdAt">) {
    const record: StateChangeRecord = {
      ...input,
      id: `state-change:${Date.now()}:${this.records.length + 1}`,
      createdAt: new Date().toISOString()
    };

    this.records.push(record);
    return record;
  }

  list() {
    return [...this.records];
  }

  since(timestamp: string) {
    const point = new Date(timestamp).getTime();

    return this.records.filter(
      (record) =>
        new Date(record.createdAt).getTime() > point
    );
  }

  summary() {
    return {
      total: this.records.length,
      created: this.records.filter((x) => x.type === "created").length,
      updated: this.records.filter((x) => x.type === "updated").length,
      reconciled:
        this.records.filter((x) => x.type === "reconciled").length,
      restored: this.records.filter((x) => x.type === "restored").length
    };
  }
}
