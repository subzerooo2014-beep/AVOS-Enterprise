import { Injectable, NotFoundException } from "@nestjs/common";
import { DataContractRegistryService } from "./data-contract-registry.service";
import { FederationLineageService } from "./federation-lineage.service";
import { FederationNodeRegistryService } from "./federation-node-registry.service";
import { FederationQualityMonitorService } from "./federation-quality-monitor.service";
import type { DataExchangeMessageRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class DataExchangeHubService {
  private readonly messages = new Map<string, DataExchangeMessageRecord>();

  constructor(
    private readonly nodes: FederationNodeRegistryService,
    private readonly contracts: DataContractRegistryService,
    private readonly lineage: FederationLineageService,
    private readonly quality: FederationQualityMonitorService,
  ) {}

  publish(
    contractId: string,
    sourceNodeId: string,
    targetNodeId: string,
    payload: Record<string, unknown>,
    requiredFields: string[] = [],
  ): DataExchangeMessageRecord {
    const source = this.nodes.get(sourceNodeId);
    const target = this.nodes.get(targetNodeId);
    const contract = this.contracts.get(contractId);

    if (source.status !== "ACTIVE" || target.status !== "ACTIVE") {
      throw new Error("Both federation nodes must be active.");
    }

    if (contract.status !== "ACTIVE") {
      throw new Error(`Data contract '${contractId}' is not active.`);
    }

    const message: DataExchangeMessageRecord = {
      id: `exchange-message-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      contractId,
      sourceNodeId,
      targetNodeId,
      payload: { ...payload },
      status: "QUEUED",
      createdAt: new Date().toISOString(),
    };

    this.messages.set(message.id, message);
    this.quality.check(message.id, message.payload, requiredFields);
    this.lineage.record(
      message.id,
      sourceNodeId,
      targetNodeId,
      contractId,
    );

    return this.clone(message);
  }

  deliver(id: string): DataExchangeMessageRecord {
    const message = this.requireMessage(id);
    message.status = "DELIVERED";
    message.deliveredAt = new Date().toISOString();
    return this.clone(message);
  }

  fail(id: string, error: string): DataExchangeMessageRecord {
    const message = this.requireMessage(id);
    message.status = "FAILED";
    message.error = error;
    return this.clone(message);
  }

  list(): DataExchangeMessageRecord[] {
    return Array.from(this.messages.values()).map((message) =>
      this.clone(message),
    );
  }

  count(): number {
    return this.messages.size;
  }

  deliveredCount(): number {
    return this.list().filter((message) => message.status === "DELIVERED")
      .length;
  }

  failedCount(): number {
    return this.list().filter((message) => message.status === "FAILED").length;
  }

  private requireMessage(id: string): DataExchangeMessageRecord {
    const message = this.messages.get(id);

    if (!message) {
      throw new NotFoundException(`Exchange message '${id}' was not found.`);
    }

    return message;
  }

  private clone(message: DataExchangeMessageRecord): DataExchangeMessageRecord {
    return {
      ...message,
      payload: { ...message.payload },
    };
  }
}
