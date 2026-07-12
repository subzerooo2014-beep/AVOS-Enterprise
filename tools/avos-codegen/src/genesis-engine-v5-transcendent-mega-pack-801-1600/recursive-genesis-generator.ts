import {
  V5GenesisPlan,
  V5TranscendentInput,
} from "./contracts";

export class V5RecursiveSystemGenesisGenerator {
  generate(input: V5TranscendentInput): V5GenesisPlan[] {
    if (input.enableRecursiveGenesis === false) return [];

    return input.capabilityDomains.map((capability, index) => ({
      key: `${capability}-recursive-genesis`,
      sourceCapabilities: [
        capability,
        ...input.capabilityDomains.slice(0, 2),
      ],
      generatedCapabilities: [
        `${capability}-adaptive`,
        `${capability}-autonomous`,
        `${capability}-self-optimizing`,
      ],
      recursionDepth: Math.min(7, 3 + index),
    }));
  }
}
