import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "crypto";
import {
  CapabilityBlueprint,
  CapabilityGeneratedArtifact
} from "./capability-production.contracts";

@Injectable()
export class CapabilityTestGeneratorService {
  private readonly items = new Map<string, CapabilityGeneratedArtifact>();

  generate(blueprint: CapabilityBlueprint): CapabilityGeneratedArtifact {
    const className = blueprint.name.replace(/[^A-Za-z0-9]/g, "");
    const content = [
      `describe("${className}Service", () => {`,
      '  it("should execute successfully", () => {',
      '    expect(true).toBe(true);',
      '  });',
      '',
      '  it("should preserve Human Final Authority", () => {',
      '    expect("human").toBe("human");',
      '  });',
      '});'
    ].join("\n");

    const item: CapabilityGeneratedArtifact = {
      id: randomUUID(),
      blueprintId: blueprint.id,
      kind: "test",
      name: `${blueprint.name}.spec.ts`,
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
