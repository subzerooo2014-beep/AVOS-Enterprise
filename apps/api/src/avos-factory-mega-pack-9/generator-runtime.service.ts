import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  GeneratorExecutionContext,
  GeneratorExecutionRequest,
  GeneratorExecutionResult
} from "./generator-runtime.contracts";
import { PluginResolverService } from "./plugin-resolver.service";
import { RuntimeValidationService } from "./runtime-validation.service";
import { ExecutionHistoryService } from "./execution-history.service";
import { RuntimeMetricsService } from "./runtime-metrics.service";

@Injectable()
export class GeneratorRuntimeService {
  constructor(
    private readonly resolver: PluginResolverService,
    private readonly validation: RuntimeValidationService,
    private readonly history: ExecutionHistoryService,
    private readonly metrics: RuntimeMetricsService
  ) {}

  async execute(
    request: GeneratorExecutionRequest
  ): Promise<GeneratorExecutionResult> {
    const requestValidation =
      this.validation.validateRequest(request);

    this.validation.assertValid(requestValidation);

    const plugin =
      this.resolver.resolve(request.pluginId);

    const pluginValidation =
      this.validation.validatePlugin(plugin, request);

    this.validation.assertValid(
      requestValidation,
      pluginValidation
    );

    const startedAt = new Date();

    const context: GeneratorExecutionContext = {
      executionId: randomUUID(),
      pluginId: request.pluginId,
      target: request.target,
      startedAt,
      metadata: request.metadata ?? {}
    };

    let result: GeneratorExecutionResult;

    try {
      const output = await plugin.generate({
        target: context.target,
        input: request.input,
        metadata: context.metadata,
        executionId: context.executionId
      });

      const finishedAt = new Date();

      result = {
        executionId: context.executionId,
        success: true,
        pluginId: context.pluginId,
        target: context.target,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
        output,
        warnings: [],
        errors: []
      };
    } catch (error) {
      const finishedAt = new Date();

      result = {
        executionId: context.executionId,
        success: false,
        pluginId: context.pluginId,
        target: context.target,
        startedAt,
        finishedAt,
        durationMs:
          finishedAt.getTime() -
          startedAt.getTime(),
        warnings: [],
        errors: [
          error instanceof Error
            ? error.message
            : "Unknown generator runtime error."
        ]
      };
    }

    this.history.record(result);
    this.metrics.record(result);

    return result;
  }
}
