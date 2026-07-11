import {
  SystemGenerationArtifactFactory,
} from "./artifact-factory";
import {
  SystemGenerationGenerator,
} from "./generator";
import {
  InMemorySystemGenerationTemplateCatalog,
} from "./in-memory-template-catalog";
import {
  SystemGenerationOrchestrator,
} from "./orchestrator";
import {
  SystemGenerationPlanBuilder,
} from "./plan-builder";
import {
  SystemGenerationValidator,
} from "./validator";
import {
  SystemGenerationVerifier,
} from "./verifier";

export class SystemGenerationRuntimeFactory {
  create():
    SystemGenerationOrchestrator {
    const templates =
      new InMemorySystemGenerationTemplateCatalog();

    const artifacts =
      new SystemGenerationArtifactFactory(
        templates,
      );

    return new SystemGenerationOrchestrator(
      new SystemGenerationValidator(),
      new SystemGenerationPlanBuilder(),
      new SystemGenerationGenerator(
        artifacts,
      ),
      new SystemGenerationVerifier(),
    );
  }
}
