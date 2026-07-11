import {
  GenesisArchitectureValidator,
} from "./architecture-validator";
import {
  GenesisBlueprintCatalog,
} from "./blueprint-catalog";
import {
  GenesisBlueprintComposer,
} from "./blueprint-composer";
import {
  GenesisCapabilityGraphBuilder,
} from "./capability-graph-builder";
import {
  GenesisGenerationResult,
  GenesisSystemSpecification,
  GenesisSystemStatus,
} from "./contracts";
import {
  GenesisEnterpriseBrainRegistrar,
} from "./enterprise-brain-registrar";
import {
  GenesisEvidenceLedger,
} from "./evidence-ledger";
import {
  GenesisGenerationPlanBuilder,
} from "./plan-builder";
import {
  GenesisStageExecutor,
} from "./stage-executor";
import {
  GenesisSystemSpecificationRegistry,
} from "./specification-registry";

export class GenesisSystemGenerationOrchestrator {
  readonly specifications =
    new GenesisSystemSpecificationRegistry();

  readonly composer:
    GenesisBlueprintComposer;

  readonly graphs =
    new GenesisCapabilityGraphBuilder();

  readonly validator =
    new GenesisArchitectureValidator();

  readonly plans =
    new GenesisGenerationPlanBuilder();

  readonly evidence =
    new GenesisEvidenceLedger();

  readonly brain =
    new GenesisEnterpriseBrainRegistrar();

  readonly stages =
    new GenesisStageExecutor();

  constructor(
    catalog:
      GenesisBlueprintCatalog,
  ) {
    this.composer =
      new GenesisBlueprintComposer(
        catalog,
      );
  }

  async generate(
    input: Omit<
      GenesisSystemSpecification,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ): Promise<GenesisGenerationResult> {
    const specification =
      this.specifications.create(
        input,
      );

    this.evidence.append({
      systemId:
        specification.id,
      category:
        "genesis",
      action:
        "specification.created",
      message:
        "Genesis system specification created.",
    });

    this.specifications.transition(
      specification.id,
      GenesisSystemStatus.VALIDATING,
    );

    const validatingSpecification =
      this.specifications.get(
        specification.id,
      );

    const composition =
      this.composer.compose(
        validatingSpecification,
      );

    const graph =
      this.graphs.build(
        validatingSpecification,
        composition,
      );

    const validation =
      this.validator.validate(
        validatingSpecification,
        composition,
        graph,
      );

    this.evidence.append({
      systemId:
        specification.id,
      category:
        "architecture",
      action:
        "architecture.validated",
      message:
        `Architecture validation completed with score ${validation.score}.`,
      metadata: {
        valid:
          validation.valid,
        score:
          validation.score,
        findings:
          validation.findings.length,
      },
    });

    if (!validation.valid) {
      const failedSpecification =
        this.specifications.transition(
          specification.id,
          GenesisSystemStatus.FAILED,
        );

      return {
        success: false,
        specification:
          failedSpecification,
        composition,
        graph,
        validation,
        stageResults: [],
        artifacts: [],
        evidence:
          this.evidence.list(
            specification.id,
          ),
        knowledge: [],
        completedAt:
          new Date().toISOString(),
      };
    }

    this.specifications.transition(
      specification.id,
      GenesisSystemStatus.PLANNED,
    );

    const plan =
      this.plans.build(
        this.specifications.get(
          specification.id,
        ),
        composition,
        validation,
      );

    this.specifications.transition(
      specification.id,
      GenesisSystemStatus.GENERATING,
    );

    const stageResults = [];

    for (
      const stage of
      plan.stages
    ) {
      const result =
        await this.stages.execute(
          stage,
        );

      stageResults.push(result);

      this.evidence.append({
        systemId:
          specification.id,
        category:
          "generation",
        action:
          "stage.executed",
        message:
          `Stage ${stage.key} completed with success=${result.success}.`,
        metadata: {
          stage:
            stage.key,
          success:
            result.success,
          artifacts:
            result.artifacts.length,
        },
      });

      if (
        stage.mandatory &&
        !result.success
      ) {
        const failedSpecification =
          this.specifications.transition(
            specification.id,
            GenesisSystemStatus.FAILED,
          );

        return {
          success: false,
          specification:
            failedSpecification,
          composition,
          graph,
          validation,
          plan,
          stageResults,
          artifacts:
            stageResults.flatMap(
              (item) =>
                item.artifacts,
            ),
          evidence:
            this.evidence.list(
              specification.id,
            ),
          knowledge: [],
          completedAt:
            new Date().toISOString(),
        };
      }
    }

    this.specifications.transition(
      specification.id,
      GenesisSystemStatus.VERIFYING,
    );

    const knowledge =
      this.brain.registerSystem(
        this.specifications.get(
          specification.id,
        ),
        composition,
        graph,
        validation,
      );

    const completedSpecification =
      this.specifications.transition(
        specification.id,
        GenesisSystemStatus.COMPLETED,
      );

    this.evidence.append({
      systemId:
        specification.id,
      category:
        "genesis",
      action:
        "generation.completed",
      message:
        "Genesis system generation completed successfully.",
    });

    return {
      success: true,
      specification:
        completedSpecification,
      composition,
      graph,
      validation,
      plan,
      stageResults,
      artifacts:
        stageResults.flatMap(
          (item) =>
            item.artifacts,
        ),
      evidence:
        this.evidence.list(
          specification.id,
        ),
      knowledge,
      completedAt:
        new Date().toISOString(),
    };
  }
}
