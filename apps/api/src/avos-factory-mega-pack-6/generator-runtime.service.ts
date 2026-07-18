import { BadRequestException, Injectable } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import {
  GeneratedArtifact,
  GeneratorDescriptor,
  GeneratorExecutionRecord,
  GeneratorExecutionRequest,
  GeneratorRuntimeMetrics,
  GeneratorRuntimeStatus
} from "./generator-runtime.contracts";
import { GeneratorArtifactStoreService } from "./generator-artifact-store.service";
import { GeneratorExecutionStoreService } from "./generator-execution-store.service";
import { GeneratorRegistryService } from "./generator-registry.service";

@Injectable()
export class GeneratorRuntimeService {
  private readonly features = [
    "generator-registry",
    "generator-lifecycle",
    "runtime-context",
    "execution-sandbox",
    "job-execution",
    "retry-policy",
    "artifact-store",
    "telemetry",
    "version-compatibility",
    "generator-certification",
    "plugin-ready-runtime",
    "human-final-authority"
  ];

  constructor(
    private readonly registry: GeneratorRegistryService,
    private readonly artifactStore: GeneratorArtifactStoreService,
    private readonly executionStore: GeneratorExecutionStoreService
  ) {}

  registerGenerator(input: GeneratorDescriptor): GeneratorDescriptor {
    if (!input?.id?.trim() || !input?.name?.trim() || !input?.version?.trim()) {
      throw new BadRequestException("Generator id, name, and version are required.");
    }

    return this.registry.register({
      ...input,
      status: "registered",
      certified: false,
      maxRetries: input.maxRetries ?? 2,
      metadata: input.metadata ?? {}
    });
  }

  validateGenerator(id: string): GeneratorDescriptor {
    const generator = this.registry.get(id);

    if (generator.supportedTargets.length === 0) {
      throw new BadRequestException("Generator must support at least one target.");
    }

    generator.status = "validated";
    return this.registry.save(generator);
  }

  certifyGenerator(id: string, approvedBy: string): GeneratorDescriptor {
    const generator = this.registry.get(id);

    if (!approvedBy?.trim()) {
      throw new BadRequestException(
        "approvedBy is required by Human Final Authority."
      );
    }

    if (generator.status !== "validated" && generator.status !== "ready") {
      throw new BadRequestException(
        "Generator must be validated before certification."
      );
    }

    generator.status = "ready";
    generator.certified = true;
    generator.metadata = {
      ...generator.metadata,
      certifiedAt: new Date().toISOString(),
      approvedBy: approvedBy.trim()
    };

    return this.registry.save(generator);
  }

  execute(request: GeneratorExecutionRequest): GeneratorExecutionRecord {
    const generator = this.registry.get(request.generatorId);

    if (!generator.certified || generator.status !== "ready") {
      throw new BadRequestException(
        `Generator ${generator.id} is not certified and ready.`
      );
    }

    if (!generator.supportedTargets.includes(request.target)) {
      throw new BadRequestException(
        `Generator ${generator.id} does not support target ${request.target}.`
      );
    }

    if (!request.requestedBy?.trim()) {
      throw new BadRequestException("requestedBy is required.");
    }

    const executionId = `generator-execution:${randomUUID()}`;
    const record: GeneratorExecutionRecord = {
      id: executionId,
      request: structuredClone(request),
      context: {
        executionId,
        generatorId: generator.id,
        planId: request.planId,
        stageId: request.stageId,
        target: request.target,
        attempt: 1,
        maxRetries: generator.maxRetries,
        requestedBy: request.requestedBy.trim(),
        startedAt: new Date().toISOString()
      },
      status: "running",
      artifacts: [],
      logs: [
        "Execution accepted by Generator Runtime.",
        `Generator ${generator.id} selected.`,
        `Target ${request.target} validated.`
      ]
    };

    this.executionStore.save(record);

    try {
      const artifact = this.createArtifact(record, generator);
      record.artifacts.push(artifact);
      record.logs.push(`Artifact ${artifact.id} created.`);
      record.status = "completed";
      record.completedAt = new Date().toISOString();
    }
    catch (error) {
      record.status = "failed";
      record.error = error instanceof Error ? error.message : String(error);
      record.logs.push(`Execution failed: ${record.error}`);
      record.completedAt = new Date().toISOString();
    }

    return this.executionStore.save(record);
  }

  retry(executionId: string): GeneratorExecutionRecord {
    const previous = this.executionStore.get(executionId);

    if (previous.status !== "failed") {
      throw new BadRequestException("Only failed executions can be retried.");
    }

    if (previous.context.attempt >= previous.context.maxRetries + 1) {
      throw new BadRequestException("Maximum retry count reached.");
    }

    const retried = this.execute(previous.request);
    retried.context.attempt = previous.context.attempt + 1;
    retried.logs.unshift(`Retry of ${previous.id}.`);

    return this.executionStore.save(retried);
  }

  getStatus(): GeneratorRuntimeStatus {
    return {
      system: "AVOS Factory",
      megaPack: 6,
      component: "Generator Runtime",
      status: "healthy",
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      features: [...this.features],
      metrics: this.getMetrics()
    };
  }

  getMetrics(): GeneratorRuntimeMetrics {
    const generators = this.registry.list();
    const executions = this.executionStore.list();
    const completed = executions.filter((item) => item.status === "completed").length;
    const failed = executions.filter((item) => item.status === "failed").length;

    return {
      registeredGenerators: generators.length,
      certifiedGenerators: generators.filter((item) => item.certified).length,
      totalExecutions: executions.length,
      completedExecutions: completed,
      failedExecutions: failed,
      successRate:
        executions.length === 0
          ? 100
          : Math.round((completed / executions.length) * 100),
      artifactsProduced: this.artifactStore.count()
    };
  }

  listGenerators(): GeneratorDescriptor[] {
    return this.registry.list();
  }

  listExecutions(): GeneratorExecutionRecord[] {
    return this.executionStore.list();
  }

  listArtifacts(): GeneratedArtifact[] {
    return this.artifactStore.list();
  }

  runSmoke(): Record<string, unknown> {
    const id = `generator:smoke:${randomUUID()}`;

    this.registerGenerator({
      id,
      name: "AVOS Smoke Generator",
      version: "1.0.0",
      kind: "test",
      supportedTargets: ["nestjs"],
      capabilities: ["artifact-generation"],
      status: "registered",
      certified: false,
      maxRetries: 2,
      metadata: {
        smoke: true
      }
    });

    this.validateGenerator(id);
    this.certifyGenerator(id, "human:khalifa");

    const execution = this.execute({
      generatorId: id,
      planId: "factory-plan:smoke",
      stageId: "stage:backend",
      target: "nestjs",
      payload: {
        module: "SmokeModule"
      },
      requestedBy: "human:khalifa"
    });

    return {
      success: execution.status === "completed",
      generatorId: id,
      executionId: execution.id,
      artifactCount: execution.artifacts.length,
      metrics: this.getMetrics(),
      checks: {
        registry: this.registry.count() > 0,
        validation: this.registry.get(id).status === "ready",
        certification: this.registry.get(id).certified,
        executionContext: execution.context.executionId === execution.id,
        artifactStore: this.artifactStore.count() > 0,
        telemetry: execution.logs.length > 0,
        humanFinalAuthority:
          this.registry.get(id).metadata["approvedBy"] === "human:khalifa"
      }
    };
  }

  private createArtifact(
    record: GeneratorExecutionRecord,
    generator: GeneratorDescriptor
  ): GeneratedArtifact {
    const raw = JSON.stringify({
      executionId: record.id,
      generatorId: generator.id,
      target: record.request.target,
      payload: record.request.payload ?? {}
    });

    const contentHash = createHash("sha256").update(raw).digest("hex");

    const artifact: GeneratedArtifact = {
      id: `artifact:${randomUUID()}`,
      executionId: record.id,
      generatorId: generator.id,
      type: record.request.target,
      name: `${generator.name}-${record.request.stageId}`,
      contentHash,
      metadata: {
        planId: record.request.planId,
        stageId: record.request.stageId,
        generatedBy: "AVOS Factory Generator Runtime"
      },
      createdAt: new Date().toISOString()
    };

    return this.artifactStore.save(artifact);
  }
}
