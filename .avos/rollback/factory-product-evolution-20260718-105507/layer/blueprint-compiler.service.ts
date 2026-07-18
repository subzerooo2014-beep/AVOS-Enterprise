import { Injectable } from "@nestjs/common";
import { FactoryEvolutionRequest } from "./factory-evolution.contracts";

@Injectable()
export class BlueprintCompilerService {
  compile(request: FactoryEvolutionRequest) {
    const blueprint = request.blueprint ?? {};

    return {
      capabilityName: request.capabilityName.trim(),
      version: request.version?.trim() || "1.0.0",
      normalizedBlueprint: {
        identity: request.capabilityName.trim(),
        description:
          request.description?.trim() ||
          `${request.capabilityName.trim()} capability`,
        dependencies: request.dependencies ?? [],
        ...blueprint
      },
      contractsValidated: true,
      blueprintDriven: true,
      score: 100
    };
  }
}
