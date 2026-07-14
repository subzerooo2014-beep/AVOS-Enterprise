import { Body, Controller, Get, Post } from "@nestjs/common";
import { AiInfrastructureCoreService } from "./ai-infrastructure-core.service";
import { ModelRegistryService } from "./services/model-registry.service";
import { PromptRegistryService } from "./services/prompt-registry.service";
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
import { ModelRoutingService } from "./services/model-routing.service";
import { AiInfrastructureDashboardService } from "./services/ai-infrastructure-dashboard.service";

@Controller("ai-infrastructure-core")
export class AiInfrastructureCoreController {
  constructor(
    private readonly os:AiInfrastructureCoreService,
    private readonly models:ModelRegistryService,
    private readonly prompts:PromptRegistryService,
    private readonly collections:VectorCollectionService,
    private readonly vectorStore:VectorStoreService,
    private readonly vectorSearch:VectorSearchService,
    private readonly rag: RagPipelineService,
    private readonly ragExecution:RagExecutionService,
    private readonly evaluations:EvaluationSuiteService,
    private readonly evaluationRunner:EvaluationRunnerService,
    private readonly fineTuning:FineTuningJobService,
    private readonly fineTuningRunner:FineTuningRunnerService,
    private readonly guardrails:GuardrailRegistryService,
    private readonly guardrailEvaluation:GuardrailEvaluationService,
    private readonly providers:ProviderRegistryService,
    private readonly routing:ModelRoutingService,
    private readonly dashboard:AiInfrastructureDashboardService,
  ){}

  @Get("health") health(){return this.os.health();}
  @Post("models") model(@Body() b:any){return {success:true,model:this.models.create(b)};}
  @Post("prompts") prompt(@Body() b:any){return {success:true,prompt:this.prompts.create(b)};}
  @Post("vectors/collections") collection(@Body() b:any){return {success:true,collection:this.collections.create(b)};}
  @Post("vectors/upsert") vector(@Body() b:any){return {success:true,vector:this.vectorStore.create(b)};}
  @Post("vectors/search") vectorSearchRun(@Body() b:any){return {success:true,result:this.vectorSearch.create(b)};}
  @Post("rag/pipelines") ragPipeline(@Body() b:any){return {success:true,pipeline:this.rag.create(b)};}
  @Post("rag/execute") ragRun(@Body() b:any){return {success:true,result:this.ragExecution.create(b)};}
  @Post("evaluations") evaluation(@Body() b:any){return {success:true,suite:this.evaluations.create(b)};}
  @Post("evaluations/run") evaluationRun(@Body() b:any){return {success:true,result:this.evaluationRunner.create(b)};}
  @Post("fine-tuning/jobs") fineTuningJob(@Body() b:any){return {success:true,job:this.fineTuning.create(b)};}
  @Post("fine-tuning/run") fineTuningRun(@Body() b:any){return {success:true,result:this.fineTuningRunner.create(b)};}
  @Post("guardrails") guardrail(@Body() b:any){return {success:true,guardrail:this.guardrails.create(b)};}
  @Post("guardrails/evaluate") guardrailRun(@Body() b:any){return {success:true,result:this.guardrailEvaluation.create(b)};}
  @Post("providers") provider(@Body() b:any){return {success:true,provider:this.providers.create(b)};}
  @Post("model-routes") modelRoute(@Body() b:any){return {success:true,route:this.routing.create(b)};}
  @Get("operations/dashboard") operations(){return {success:true,dashboard:this.dashboard.summary()};}
}
