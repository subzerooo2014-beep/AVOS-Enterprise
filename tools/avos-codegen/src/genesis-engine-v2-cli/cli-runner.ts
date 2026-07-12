import path from "node:path";
import { access } from "node:fs/promises";
import {
  GenesisCliExecutionResult,
  GenesisCliSpecification,
} from "./contracts";
import { GenesisSpecificationLoader } from "./specification-loader";
import { GenesisEndToEndOrchestrator } from "../genesis-engine-v2-e2e";

export class GenesisCliRunner {
  constructor(
    readonly loader = new GenesisSpecificationLoader(),
    readonly orchestrator = new GenesisEndToEndOrchestrator(),
  ) {}

  async run(
    specificationPath: string,
  ): Promise<GenesisCliExecutionResult> {
    const absoluteSpecificationPath = path.resolve(specificationPath);
    const specification = await this.loader.load(
      absoluteSpecificationPath,
    );

    if (specification.mode === "dry-run") {
      await this.validateDryRun(specification);

      return {
        success: true,
        mode: specification.mode,
        specificationPath: absoluteSpecificationPath,
        pipelineExecuted: false,
        pipelineResult: null,
        summary: {
          systemKey: specification.pipeline.intent.systemKey,
          outputDirectory: specification.pipeline.outputDirectory,
          domains: specification.pipeline.intent.domains.length,
          validationGates:
            specification.pipeline.validationGates.length,
          releaseVersion: null,
          failedStage: null,
        },
        completedAt: new Date().toISOString(),
      };
    }

    const pipelineResult = await this.orchestrator.execute(
      specification.pipeline,
    );

    return {
      success: pipelineResult.success,
      mode: specification.mode,
      specificationPath: absoluteSpecificationPath,
      pipelineExecuted: true,
      pipelineResult,
      summary: {
        systemKey: specification.pipeline.intent.systemKey,
        outputDirectory: specification.pipeline.outputDirectory,
        domains: specification.pipeline.intent.domains.length,
        validationGates:
          specification.pipeline.validationGates.length,
        releaseVersion: pipelineResult.releaseVersion,
        failedStage: pipelineResult.failedStage,
      },
      completedAt: new Date().toISOString(),
    };
  }

  private async validateDryRun(
    specification: GenesisCliSpecification,
  ): Promise<void> {
    const parentDirectory = path.dirname(
      path.resolve(specification.pipeline.outputDirectory),
    );

    await access(parentDirectory);
  }
}
