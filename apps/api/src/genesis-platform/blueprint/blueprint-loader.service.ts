import { BadRequestException, Injectable } from "@nestjs/common";
import { GenesisBlueprint } from "../types/genesis-platform.types";

@Injectable()
export class BlueprintLoaderService {
  load(input: GenesisBlueprint): GenesisBlueprint {
    if (!input || typeof input !== "object") {
      throw new BadRequestException("A valid blueprint object is required.");
    }

    return {
      ...structuredClone(input),
      requestedCapabilities: input.requestedCapabilities ?? [],
      artifacts: input.artifacts ?? [],
      policies: input.policies ?? [],
      metadata: input.metadata ?? {},
    };
  }
}
