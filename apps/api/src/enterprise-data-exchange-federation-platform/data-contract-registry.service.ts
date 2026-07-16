import { Injectable, NotFoundException } from "@nestjs/common";
import { SchemaRegistryService } from "./schema-registry.service";
import type { DataContractRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class DataContractRegistryService {
  private readonly contracts = new Map<string, DataContractRecord>();

  constructor(private readonly schemas: SchemaRegistryService) {}

  register(
    input: Omit<DataContractRecord, "createdAt" | "updatedAt">,
  ): DataContractRecord {
    this.schemas.get(input.schemaId);

    const existing = this.contracts.get(input.id);
    const now = new Date().toISOString();

    const contract: DataContractRecord = {
      ...input,
      consumers: [...input.consumers],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.contracts.set(contract.id, contract);
    return this.clone(contract);
  }

  get(id: string): DataContractRecord {
    const contract = this.contracts.get(id);

    if (!contract) {
      throw new NotFoundException(`Data contract '${id}' was not found.`);
    }

    return this.clone(contract);
  }

  list(): DataContractRecord[] {
    return Array.from(this.contracts.values()).map((contract) =>
      this.clone(contract),
    );
  }

  count(): number {
    return this.contracts.size;
  }

  activeCount(): number {
    return this.list().filter((contract) => contract.status === "ACTIVE")
      .length;
  }

  private clone(contract: DataContractRecord): DataContractRecord {
    return {
      ...contract,
      consumers: [...contract.consumers],
    };
  }
}
