import { Injectable } from "@nestjs/common";
import {
  FactoryBlueprintIR,
  FactoryGeneratedFile,
  FactoryGenerationPackage,
  FactoryValidationReport,
} from "../contracts/generation.contracts";
import { createFactoryId } from "../utils/factory-id.util";

@Injectable()
export class FactoryGenerationPackageService {
  private readonly packages = new Map<string, FactoryGenerationPackage>();

  create(
    jobId: string,
    blueprint: FactoryBlueprintIR,
    files: FactoryGeneratedFile[],
    validation: FactoryValidationReport,
  ): FactoryGenerationPackage {
    const generationPackage: FactoryGenerationPackage = {
      id: createFactoryId("factory-generation-package"),
      projectId: blueprint.projectId,
      blueprintId: blueprint.id,
      jobId,
      files,
      validation,
      manifest: {
        name: blueprint.name,
        objective: blueprint.objective,
        language: blueprint.language,
        framework: blueprint.framework,
        fileCount: files.length,
        generatedBy: "avos-code-factory",
        humanFinalAuthority:
          blueprint.metadata.humanFinalAuthority ?? true,
      },
      createdAt: new Date().toISOString(),
    };

    this.packages.set(generationPackage.id, generationPackage);
    return generationPackage;
  }

  get(id: string) {
    return this.packages.get(id);
  }

  list() {
    return [...this.packages.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
}
