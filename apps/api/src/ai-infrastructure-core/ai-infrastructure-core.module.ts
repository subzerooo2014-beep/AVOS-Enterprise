import { Module } from "@nestjs/common";
import { AiInfrastructureCoreController } from "./ai-infrastructure-core.controller";
import { AiInfrastructureCoreService } from "./ai-infrastructure-core.service";
import { ModelRegistryService } from "./services/model-registry.service";
import { ModelVersionService } from "./services/model-version.service";
import { ModelRoutingService } from "./services/model-routing.service";
import { PromptRegistryService } from "./services/prompt-registry.service";
import { PromptVersionService } from "./services/prompt-version.service";
import { PromptExecutionService } from "./services/prompt-execution.service";
import { VectorCollectionService } from "./services/vector-collection.service";
import { VectorStoreService } from "./services/vector-store.service";
import { VectorSearchService } from "./services/vector-search.service";
import { RagPipelineService } from "./services/rag-pipeline.service";
import { RagExecutionService } from "./services/rag-execution.service";
import { EvaluationSuiteService } from "./services/evaluation-suite.service";
import { EvaluationRunnerService } from "./services/evaluation-runner.service";
import { FineTuningJobService } from "./services/fine-tuning-job.service";
import { FineTuningRunnerService } from "./services/fine-tuning-runner.service";
import { GuardrailRegistryService } from "./services/guardrail-registry.service";
import { GuardrailEvaluationService } from "./services/guardrail-evaluation.service";
import { ProviderRegistryService } from "./services/provider-registry.service";
import { ProviderFailoverService } from "./services/provider-failover.service";
import { AiInfrastructureAuditService } from "./services/ai-infrastructure-audit.service";
import { AiInfrastructureDashboardService } from "./services/ai-infrastructure-dashboard.service";
import { ModelRouterRuntime } from "./runtime/model-router.runtime";
import { PromptExecutorRuntime } from "./runtime/prompt-executor.runtime";
import { VectorSearchRuntime } from "./runtime/vector-search.runtime";
import { RagOrchestratorRuntime } from "./runtime/rag-orchestrator.runtime";
import { EvaluationRuntime } from "./runtime/evaluation.runtime";
import { FineTuningRuntime } from "./runtime/fine-tuning.runtime";
import { GuardrailRuntime } from "./runtime/guardrail.runtime";
import { ProviderFailoverRuntime } from "./runtime/provider-failover.runtime";

@Module({
  controllers:[AiInfrastructureCoreController],
  providers:[
    AiInfrastructureCoreService,
    ModelRegistryService,ModelVersionService,ModelRoutingService,PromptRegistryService,PromptVersionService,
    PromptExecutionService,VectorCollectionService,VectorStoreService,VectorSearchService,RagPipelineService,
    RagExecutionService,EvaluationSuiteService,EvaluationRunnerService,FineTuningJobService,FineTuningRunnerService,
    GuardrailRegistryService,GuardrailEvaluationService,ProviderRegistryService,ProviderFailoverService,
    AiInfrastructureAuditService,AiInfrastructureDashboardService,
    ModelRouterRuntime,PromptExecutorRuntime,VectorSearchRuntime,RagOrchestratorRuntime,EvaluationRuntime,
    FineTuningRuntime,GuardrailRuntime,ProviderFailoverRuntime
  ],
  exports:[AiInfrastructureCoreService],
})
export class AiInfrastructureCoreModule {}
