import { Injectable } from "@nestjs/common";
import { DataContractRegistryService } from "./data-contract-registry.service";
import { FederationNodeRegistryService } from "./federation-node-registry.service";
import type { DataSynchronizationRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class DataSynchronizationService {
  private readonly synchronizations: DataSynchronizationRecord[] = [];

  constructor(
    private readonly nodes: FederationNodeRegistryService,
    private readonly contracts: DataContractRegistryService,
  ) {}

  run(
    sourceNodeId: string,
    targetNodeId: string,
    contractId: string,
    recordsRead: number,
    recordsWritten: number,
    error?: string,
  ): DataSynchronizationRecord {
    this.nodes.get(sourceNodeId);
    this.nodes.get(targetNodeId);
    this.contracts.get(contractId);

    const synchronization: DataSynchronizationRecord = {
      id: `data-sync-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      sourceNodeId,
      targetNodeId,
      contractId,
      status: error ? "FAILED" : "COMPLETED",
      recordsRead,
      recordsWritten,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      error,
    };

    this.synchronizations.unshift(synchronization);
    return { ...synchronization };
  }

  list(): DataSynchronizationRecord[] {
    return this.synchronizations.map((item) => ({ ...item }));
  }

  count(): number {
    return this.synchronizations.length;
  }

  failedCount(): number {
    return this.synchronizations.filter((item) => item.status === "FAILED")
      .length;
  }
}
