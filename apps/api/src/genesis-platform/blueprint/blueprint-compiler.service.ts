import { Injectable } from "@nestjs/common";
import { GenesisBlueprint } from "../types/genesis-platform.types";

@Injectable()
export class BlueprintCompilerService {
  compile(blueprint: GenesisBlueprint): GenesisBlueprint {
    const artifacts = [...blueprint.artifacts].sort((a, b) =>
      a.path.localeCompare(b.path),
    );

    return {
      ...structuredClone(blueprint),
      requestedCapabilities: [...new Set(blueprint.requestedCapabilities)].sort(),
      policies: [...new Set(blueprint.policies)].sort(),
      artifacts,
      metadata: {
        ...blueprint.metadata,
        compiledAt: new Date().toISOString(),
        compiler: "avos-genesis-blueprint-compiler",
      },
    };
  }
}
