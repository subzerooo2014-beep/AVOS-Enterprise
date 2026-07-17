import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilitySpecification
} from "./capability-production.contracts";

@Injectable()
export class CapabilitySpecificationCompilerService {
  private readonly items = new Map<string, CapabilitySpecification>();

  compile(blueprint: CapabilityBlueprint): CapabilitySpecification {
    const item: CapabilitySpecification = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      capabilityName: blueprint.name,
      inputs: blueprint.contracts.map((contract) => `${contract}:input`),
      outputs: blueprint.contracts.map((contract) => `${contract}:output`),
      behaviors: [
        `Execute ${blueprint.name}`,
        "Validate request contracts",
        "Emit governed execution result"
      ],
      nonFunctionalRequirements: [
        `Minimum quality score ${blueprint.qualityTargets.minimumScore}`,
        "Traceable execution",
        "Human Final Authority",
        "Rollback-safe release"
      ],
      generatedAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilitySpecification[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
