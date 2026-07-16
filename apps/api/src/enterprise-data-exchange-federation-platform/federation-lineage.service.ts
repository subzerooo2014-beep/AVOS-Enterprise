import { Injectable } from "@nestjs/common";
import type { FederationLineageRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class FederationLineageService {
  private readonly records: FederationLineageRecord[] = [];

  record(
    messageId: string,
    sourceNodeId: string,
    targetNodeId: string,
    contractId: string,
  ): FederationLineageRecord {
    const record: FederationLineageRecord = {
      id: `federation-lineage-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      messageId,
      sourceNodeId,
      targetNodeId,
      contractId,
      createdAt: new Date().toISOString(),
    };

    this.records.unshift(record);
    return { ...record };
  }

  list(): FederationLineageRecord[] {
    return this.records.map((record) => ({ ...record }));
  }

  count(): number {
    return this.records.length;
  }
}
