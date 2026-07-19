import { Injectable } from "@nestjs/common";
import { GenerateProjectDto } from "../dto/generate-project.dto";
import { FactoryEventBusService } from "../events/event-bus.service";
import { FactoryArtifactService } from "../workspace/artifact.service";
import { FactoryBlueprintIrService } from "./blueprint-ir.service";
import { FactoryFilePlannerService } from "./file-planner.service";
import { FactoryGenerationJobService } from "./generation-job.service";
import { FactoryGenerationPackageService } from "./package.service";
import { FactoryGenerationValidatorService } from "./generation-validator.service";
import { FactorySourceGeneratorService } from "./source-generator.service";

@Injectable()
export class FactoryGenerationEngineService {
  constructor(
    private readonly jobs: FactoryGenerationJobService,
    private readonly blueprints: FactoryBlueprintIrService,
    private readonly planner: FactoryFilePlannerService,
    private readonly sourceGenerator: FactorySourceGeneratorService,
    private readonly artifacts: FactoryArtifactService,
    private readonly validator: FactoryGenerationValidatorService,
    private readonly packages: FactoryGenerationPackageService,
    private readonly events: FactoryEventBusService,
  ) {}

  async generate(dto: GenerateProjectDto) {
    const job = this.jobs.create(
      dto.projectId,
      dto.objective,
      dto.metadata ?? {},
    );

    await this.events.publish(
      "factory.generation.started",
      "factory-generation-engine",
      {
        jobId: job.id,
        projectId: dto.projectId,
        objective: dto.objective,
      },
      { subject: job.id },
    );

    try {
      this.jobs.transition(job.id, "planning");

      const blueprint = this.blueprints.compile(dto);
      const plan = this.planner.createPlan(blueprint);

      this.jobs.transition(job.id, "rendering", {
        blueprintId: blueprint.id,
        planId: plan.id,
        filesPlanned: plan.items.length,
      });

      const generatedFiles = this.sourceGenerator.generate(plan);

      this.jobs.transition(job.id, "persisting", {
        filesGenerated: generatedFiles.length,
      });

      for (const file of generatedFiles) {
        const artifact = await this.artifacts.create({
          projectId: blueprint.projectId,
          type: file.artifactType,
          relativePath: file.relativePath,
          content: file.content,
          metadata: {
            generatedBy: "factory-generation-engine",
            generationJobId: job.id,
            blueprintId: blueprint.id,
          },
        });
        file.artifactId = artifact.id;
      }

      this.jobs.transition(job.id, "validating");
      const validation = this.validator.validate(generatedFiles);

      if (!validation.valid) {
        throw new Error(
          `Generation validation failed with score ${validation.score}.`,
        );
      }

      this.jobs.transition(job.id, "packaging");
      const generationPackage = this.packages.create(
        job.id,
        blueprint,
        generatedFiles,
        validation,
      );

      const completedJob = this.jobs.transition(job.id, "completed", {
        packageId: generationPackage.id,
      });

      await this.events.publish(
        "factory.generation.completed",
        "factory-generation-engine",
        {
          jobId: completedJob.id,
          projectId: completedJob.projectId,
          blueprintId: blueprint.id,
          planId: plan.id,
          packageId: generationPackage.id,
          filesGenerated: generatedFiles.length,
          validationScore: validation.score,
        },
        { subject: completedJob.id },
      );

      return {
        job: completedJob,
        blueprint,
        plan,
        package: generationPackage,
      };
    } catch (error) {
      const failedJob = this.jobs.fail(job.id, error);

      await this.events.publish(
        "factory.generation.failed",
        "factory-generation-engine",
        {
          jobId: failedJob.id,
          projectId: failedJob.projectId,
          errors: failedJob.errors,
        },
        { subject: failedJob.id },
      );

      throw error;
    }
  }

  status() {
    const jobs = this.jobs.list();

    return {
      totalJobs: jobs.length,
      completed: jobs.filter((job) => job.status === "completed").length,
      failed: jobs.filter((job) => job.status === "failed").length,
      active: jobs.filter(
        (job) => !["completed", "failed"].includes(job.status),
      ).length,
      packages: this.packages.list().length,
      generatedAt: new Date().toISOString(),
    };
  }
}
