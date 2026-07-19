import { Injectable } from "@nestjs/common";
import { EventContract } from "./platform-production-mega-pack-4.types";
import { EventMeshFileStoreService } from "./event-mesh-file-store.service";

@Injectable()
export class EventRegistryService {
  constructor(
    private readonly store: EventMeshFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.listContracts().length > 0) {
      return;
    }

    const defaults = [
      {
        eventType: "platform.runtime.health.updated",
        version: "1.0.0",
        schema: {
          runtimeKey: "string",
          healthScore: "number",
          state: "string",
        },
        owner: "platform-runtime",
        active: true,
        deliveryMode: "at-least-once" as const,
      },
      {
        eventType: "platform.service.route.completed",
        version: "1.0.0",
        schema: {
          serviceKey: "string",
          destination: "string",
          success: "boolean",
        },
        owner: "enterprise-service-mesh",
        active: true,
        deliveryMode: "at-least-once" as const,
      },
      {
        eventType: "platform.operations.incident.opened",
        version: "1.0.0",
        schema: {
          incidentId: "string",
          severity: "string",
          environment: "string",
        },
        owner: "enterprise-operations-control",
        active: true,
        deliveryMode: "exactly-once" as const,
      },
    ];

    for (const item of defaults) {
      this.registerContract(item);
    }
  }

  registerContract(
    input: Omit<EventContract, "id" | "createdAt" | "updatedAt">,
  ): EventContract {
    const existing = this.listContracts().find(
      (contract) =>
        contract.eventType === input.eventType &&
        contract.version === input.version,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const contract: EventContract = {
      ...input,
      id: this.id("event-contract"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`contracts/${contract.id}.json`, contract);
    return contract;
  }

  listContracts(): EventContract[] {
    return this.store.listJson<EventContract>("contracts");
  }

  resolve(eventType: string, version: string): EventContract {
    const contract = this.listContracts().find(
      (item) =>
        item.eventType === eventType &&
        item.version === version &&
        item.active,
    );

    if (!contract) {
      throw new Error(`Active event contract not found: ${eventType}@${version}`);
    }

    return contract;
  }
}