import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { FactoryDigitalDna } from "./factory-knowledge.contracts";

@Injectable()
export class FactoryDigitalDnaService {
  private readonly records = new Map<string, FactoryDigitalDna>();

  register(input: Omit<FactoryDigitalDna, "id" | "createdAt">):
    FactoryDigitalDna {
    const record: FactoryDigitalDna = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    this.records.set(`${record.entityType}:${record.entityId}`, record);
    return structuredClone(record);
  }

  all(): FactoryDigitalDna[] {
    return structuredClone([...this.records.values()]);
  }

  genome() {
    const records = this.all();
    return {
      entities: records.length,
      dependencyCount: records.reduce(
        (sum, record) => sum + record.dependencies.length,
        0,
      ),
      policyCount: records.reduce(
        (sum, record) => sum + record.policies.length,
        0,
      ),
      evolutionEvents: records.reduce(
        (sum, record) => sum + record.evolutionHistory.length,
        0,
      ),
      averageTrustScore:
        records.length === 0
          ? 0
          : Math.round(
              records.reduce((sum, record) => sum + record.trustScore, 0) /
                records.length,
            ),
    };
  }
}
