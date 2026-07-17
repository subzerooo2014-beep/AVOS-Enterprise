import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityGeneratedArtifact,
  CapabilitySpecification
} from "./capability-production.contracts";

@Injectable()
export class CapabilityContractGeneratorService {
  private readonly items = new Map<string, CapabilityGeneratedArtifact>();

  generate(
    blueprint: CapabilityBlueprint,
    specification: CapabilitySpecification
  ): CapabilityGeneratedArtifact {
    const interfaceName = blueprint.name.replace(/[^A-Za-z0-9]/g, "");
    const content = [
      `export interface ${interfaceName}Input {`,
      '  requestId: string;',
      '  payload: Record<string, unknown>;',
      '}',
      '',
      `export interface ${interfaceName}Output {`,
      '  success: boolean;',
      '  data: Record<string, unknown>;',
      '  generatedAt: string;',
      '}',
      '',
      `// Specification: ${specification.id}`
    ].join("\n");

    const item: CapabilityGeneratedArtifact = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      kind: "contract",
      name: `${blueprint.name}.contracts.ts`,
      content,
      checksum: createHash("sha256").update(content).digest("hex"),
      generatedAt: new Date().toISOString()
    };

    this.items.set(item.id, item);
    return item;
  }

  list(limit = 100): CapabilityGeneratedArtifact[] {
    return [...this.items.values()].slice(-Math.max(1, limit)).reverse();
  }
}
