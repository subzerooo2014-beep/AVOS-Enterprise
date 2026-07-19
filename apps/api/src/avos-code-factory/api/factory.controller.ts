import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateExecutionDto } from "../dto/create-execution.dto";
import { FactoryBootstrapService } from "../kernel/factory-bootstrap.service";
import { FactoryCapabilitiesService } from "../kernel/factory-capabilities.service";
import { FactoryHealthService } from "../kernel/factory-health.service";
import { FactoryLifecycleService } from "../kernel/factory-lifecycle.service";
import { FactoryVersionService } from "../kernel/factory-version.service";
import { ExecutionHistoryService } from "../runtime/execution-history.service";
import { PipelineEngineService } from "../runtime/pipeline-engine.service";
import { RuntimeEngineService } from "../runtime/runtime-engine.service";
import { RuntimeMetricsService } from "../runtime/runtime-metrics.service";
import { StageRunnerService } from "../runtime/stage-runner.service";

@Controller("avos/code-factory")
export class FactoryController {
  constructor(
    private readonly bootstrap: FactoryBootstrapService,
    private readonly version: FactoryVersionService,
    private readonly lifecycle: FactoryLifecycleService,
    private readonly capabilities: FactoryCapabilitiesService,
    private readonly health: FactoryHealthService,
    private readonly pipelines: PipelineEngineService,
    private readonly runtime: RuntimeEngineService,
    private readonly history: ExecutionHistoryService,
    private readonly metrics: RuntimeMetricsService,
    private readonly stages: StageRunnerService,
  ) {}

  @Get("status")
  status() {
    return {
      ...this.version.describe(),
      bootstrap: this.bootstrap.status(),
      lifecycle: this.lifecycle.current(),
      capabilities: this.capabilities.summary(),
      handlers: this.stages.listHandlers(),
    };
  }

  @Get("health")
  healthReport() {
    return this.health.report();
  }

  @Get("lifecycle")
  lifecycleReport() {
    return {
      current: this.lifecycle.current(),
      timeline: this.lifecycle.timeline(),
    };
  }

  @Get("capabilities")
  capabilityList() {
    return this.capabilities.list();
  }

  @Get("executions")
  executions() {
    const records = this.history.list();
    return {
      metrics: this.metrics.snapshot(records),
      records,
    };
  }

  @Get("executions/:executionId")
  execution(@Param("executionId") executionId: string) {
    return this.history.get(executionId) ?? {
      found: false,
      executionId,
    };
  }

  @Post("executions")
  async execute(@Body() dto: CreateExecutionDto) {
    const plan = this.pipelines.createPlan(dto);
    return this.runtime.execute(plan, dto.metadata ?? {});
  }
}
