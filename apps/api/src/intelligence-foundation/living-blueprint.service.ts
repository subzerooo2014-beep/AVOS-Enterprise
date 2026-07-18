import { Injectable } from "@nestjs/common";
import { LivingBlueprintRecord } from "./intelligence-foundation.types";

@Injectable()
export class LivingBlueprintService {
  private readonly blueprints = new Map<string, LivingBlueprintRecord>();

  constructor() {
    this.register({
      id: "blueprint:intelligence-foundation",
      name: "AVOS Intelligence Foundation",
      version: "1.0.0",
      architectureState: "active",
      runtimeState: "synchronized",
      capabilityIds: [
        "capability:knowledge-fabric",
        "capability:living-blueprint",
        "capability:digital-dna",
        "capability:enterprise-brain-foundation",
      ],
      dependencyIds: [
        "foundation:enterprise-kernel",
        "foundation:capability-fabric",
        "foundation:enterprise-nervous-system",
      ],
      lastSynchronizedAt: new Date().toISOString(),
    });
  }

  register(input: LivingBlueprintRecord): LivingBlueprintRecord {
    this.blueprints.set(input.id, input);
    return input;
  }

  findAll(): LivingBlueprintRecord[] {
    return [...this.blueprints.values()];
  }

  synchronize(id: string): LivingBlueprintRecord | undefined {
    const blueprint = this.blueprints.get(id);
    if (!blueprint) return undefined;

    const synchronized: LivingBlueprintRecord = {
      ...blueprint,
      runtimeState: "synchronized",
      lastSynchronizedAt: new Date().toISOString(),
    };

    this.blueprints.set(id, synchronized);
    return synchronized;
  }

  detectDrift(id: string, runtimeCapabilityIds: string[]): {
    blueprintId: string;
    drifted: boolean;
    missingAtRuntime: string[];
    unexpectedAtRuntime: string[];
  } | undefined {
    const blueprint = this.blueprints.get(id);
    if (!blueprint) return undefined;

    const expected = new Set(blueprint.capabilityIds);
    const runtime = new Set(runtimeCapabilityIds);

    const missingAtRuntime = [...expected].filter((item) => !runtime.has(item));
    const unexpectedAtRuntime = [...runtime].filter((item) => !expected.has(item));
    const drifted = missingAtRuntime.length > 0 || unexpectedAtRuntime.length > 0;

    this.blueprints.set(id, {
      ...blueprint,
      runtimeState: drifted ? "drifted" : "synchronized",
      lastSynchronizedAt: new Date().toISOString(),
    });

    return {
      blueprintId: id,
      drifted,
      missingAtRuntime,
      unexpectedAtRuntime,
    };
  }

  count(): number {
    return this.blueprints.size;
  }
}
