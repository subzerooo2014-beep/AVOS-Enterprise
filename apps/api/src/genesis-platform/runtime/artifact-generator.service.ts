import { Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import {
  GenesisArtifactDefinition,
  GenesisArtifactRecord,
} from "../types/genesis-platform.types";

@Injectable()
export class ArtifactGeneratorService {
  generate(
    blueprintId: string,
    definition: GenesisArtifactDefinition,
  ): GenesisArtifactRecord {
    const checksum = createHash("sha256")
      .update(
        JSON.stringify({
          blueprintId,
          definition,
          generatedBy: "avos-genesis-platform",
        }),
      )
      .digest("hex");

    return {
      id: `artifact:${randomUUID()}`,
      blueprintId,
      path: definition.path,
      type: definition.type,
      version: "1.0.0",
      status: "generated",
      checksum,
      dependencies: definition.dependencies,
      createdAt: new Date().toISOString(),
    };
  }
}
