import { randomUUID } from "node:crypto";
import {
  GenesisArchitectureValidation,
  GenesisBlueprintComposition,
  GenesisGenerationPlan,
  GenesisGenerationStage,
  GenesisStageKind,
  GenesisSystemSpecification,
} from "./contracts";

export class GenesisGenerationPlanBuilder {
  build(
    specification:
      GenesisSystemSpecification,
    composition:
      GenesisBlueprintComposition,
    validation:
      GenesisArchitectureValidation,
  ): GenesisGenerationPlan {
    if (!validation.valid) {
      throw new Error(
        "Cannot build a Genesis generation plan for an invalid architecture.",
      );
    }

    const stages:
      GenesisGenerationStage[] = [
        this.stage(
          "discover-system",
          "Discover System",
          GenesisStageKind.DISCOVERY,
          10,
          [],
          ["system-context"],
        ),
        this.stage(
          "resolve-blueprints",
          "Resolve Blueprints",
          GenesisStageKind.BLUEPRINT_RESOLUTION,
          20,
          ["discover-system"],
          ["blueprint-composition"],
        ),
        this.stage(
          "validate-architecture",
          "Validate Architecture",
          GenesisStageKind.ARCHITECTURE_VALIDATION,
          30,
          ["resolve-blueprints"],
          ["architecture-validation"],
        ),
        this.stage(
          "generate-system",
          "Generate System",
          GenesisStageKind.GENERATION,
          40,
          ["validate-architecture"],
          ["generated-artifacts"],
        ),
        this.stage(
          "run-quality-gates",
          "Run Quality Gates",
          GenesisStageKind.QUALITY_GATE,
          50,
          ["generate-system"],
          ["quality-report"],
        ),
        this.stage(
          "verify-system",
          "Verify System",
          GenesisStageKind.VERIFICATION,
          60,
          ["run-quality-gates"],
          ["verification-report"],
        ),
        this.stage(
          "register-knowledge",
          "Register Enterprise Knowledge",
          GenesisStageKind.KNOWLEDGE_REGISTRATION,
          70,
          ["verify-system"],
          ["enterprise-brain-records"],
        ),
      ];

    const rollbackStages:
      GenesisGenerationStage[] = [
        this.stage(
          "restore-generation-baseline",
          "Restore Generation Baseline",
          GenesisStageKind.GENERATION,
          10,
          [],
          ["restored-baseline"],
        ),
        this.stage(
          "verify-rollback",
          "Verify Rollback",
          GenesisStageKind.VERIFICATION,
          20,
          ["restore-generation-baseline"],
          ["rollback-verification"],
        ),
      ];

    stages[0]!.inputs = {
      systemKey:
        specification.key,
      blueprintCount:
        composition.selectedBlueprints.length,
      validationScore:
        validation.score,
    };

    return {
      systemId: specification.id,
      stages,
      rollbackStages,
      generatedAt:
        new Date().toISOString(),
    };
  }

  private stage(
    key: string,
    name: string,
    kind: GenesisStageKind,
    order: number,
    dependencies: string[],
    expectedOutputs: string[],
  ): GenesisGenerationStage {
    return {
      id: randomUUID(),
      key,
      name,
      kind,
      order,
      dependencies,
      mandatory: true,
      inputs: {},
      expectedOutputs,
    };
  }
}
