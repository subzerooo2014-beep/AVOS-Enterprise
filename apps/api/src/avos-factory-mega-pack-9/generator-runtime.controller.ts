import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query
} from "@nestjs/common";
import {
  GeneratorExecutionRequest
} from "./generator-runtime.contracts";
import {
  GeneratorRuntimeService
} from "./generator-runtime.service";
import {
  ExecutionHistoryService
} from "./execution-history.service";
import {
  RuntimeMetricsService
} from "./runtime-metrics.service";

@Controller("avos/factory/runtime")
export class GeneratorRuntimeController {
  constructor(
    private readonly runtime:
      GeneratorRuntimeService,
    private readonly history:
      ExecutionHistoryService,
    private readonly metrics:
      RuntimeMetricsService
  ) {}

  @Get("status")
  status() {
    const metrics =
      this.metrics.getMetrics();

    return {
      healthy: true,
      component:
        "AVOS Factory Generator Execution Runtime",
      version: "1.0.0",
      executions:
        metrics.totalExecutions,
      successful:
        metrics.successfulExecutions,
      failed:
        metrics.failedExecutions
    };
  }

  @Post("execute")
  async execute(
    @Body() request:
      GeneratorExecutionRequest
  ) {
    return this.runtime.execute(request);
  }

  @Get("history")
  historyList(
    @Query(
      "limit",
      new ParseIntPipe({
        optional: true
      })
    )
    limit?: number
  ) {
    return this.history.list(limit ?? 100);
  }

  @Get("metrics")
  runtimeMetrics() {
    return this.metrics.getMetrics();
  }

  @Get("executions/:executionId")
  execution(
    @Param("executionId")
    executionId: string
  ) {
    const record =
      this.history.get(executionId);

    if (!record) {
      throw new NotFoundException(
        `Generator execution "${executionId}" was not found.`
      );
    }

    return record;
  }
}
