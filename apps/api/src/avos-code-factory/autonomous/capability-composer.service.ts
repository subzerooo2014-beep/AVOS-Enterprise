import { Injectable } from "@nestjs/common";
import {
  CompiledFactoryBlueprint,
} from "../contracts/autonomous-factory.contracts";
import { FactoryGenerationEngineService } from "../generation/generation-engine.service";
import { FactoryArchitectureGeneratorService } from "./architecture-generator.service";

@Injectable()
export class FactoryCapabilityComposerService {
  constructor(
    private readonly architecture: FactoryArchitectureGeneratorService,
    private readonly generation: FactoryGenerationEngineService,
  ) {}

  async compose(blueprint: CompiledFactoryBlueprint) {
    return Promise.all(
      blueprint.applications.map(async (application) => {
        const generationRequest =
          this.architecture.generateApplication(
            blueprint,
            application,
          );

        const result = await this.generation.generate(
          generationRequest,
        );

        return {
          applicationId: application.id,
          applicationName: application.name,
          framework: application.framework,
          generation: result,
        };
      }),
    );
  }
}
