import { Module } from "@nestjs/common";
import { ExecutionContextService } from "./execution-context.service";
import { ExecutionHistoryService } from "./execution-history.service";
import { PipelineEngineService } from "./pipeline-engine.service";
import { RuntimeEngineService } from "./runtime-engine.service";
import { RuntimeMetricsService } from "./runtime-metrics.service";
import { StageRunnerService } from "./stage-runner.service";
import { StateStoreService } from "./state-store.service";

@Module({
  providers: [
    ExecutionContextService,
    ExecutionHistoryService,
    PipelineEngineService,
    RuntimeEngineService,
    RuntimeMetricsService,
    StageRunnerService,
    StateStoreService,
  ],
  exports: [
    ExecutionContextService,
    ExecutionHistoryService,
    PipelineEngineService,
    RuntimeEngineService,
    RuntimeMetricsService,
    StageRunnerService,
    StateStoreService,
  ],
})
export class FactoryRuntimeModule {}
