import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityGeneratedArtifact,
  CapabilitySpecification
} from "./capability-production.contracts";

@Injectable()
export class CapabilityCodeGeneratorService {
  private readonly items = new Map<string, CapabilityGeneratedArtifact>();

  generate(
    blueprint: CapabilityBlueprint,
    specification: CapabilitySpecification
  ): CapabilityGeneratedArtifact {
    const className = blueprint.name.replace(/[^A-Za-z0-9]/g, "");
    const content = [
      'import { Injectable } from "@nestjs/common";',
      '',
      '@Injectable()',
      `export class ${className}Service {`,
      '  execute(payload: Record<string, unknown>) {',
      '    return {',
      '      success: true,',
      '      data: payload,',
      '      generatedAt: new Date().toISOString()',
      '    };',
      '  }',
      '}',
      '',
      `// Blueprint: ${blueprint.id}`,
      `// Specification: ${specification.id}`
    ].join("\n");

    const item: CapabilityGeneratedArtifact = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      kind: "code",
      name: `${blueprint.name}.service.ts`,
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
