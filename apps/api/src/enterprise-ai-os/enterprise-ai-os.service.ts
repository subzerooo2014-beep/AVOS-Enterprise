import { Injectable } from "@nestjs/common";
import { AgentRegistryService } from "./services/agent-registry.service";
import { TaskRuntimeService } from "./services/task-runtime.service";
import { MemoryStoreService } from "./services/memory-store.service";
import { KnowledgeGraphService } from "./services/knowledge-graph.service";
import { WorkflowRuntimeService } from "./services/workflow-runtime.service";
import { LearningStoreService } from "./services/learning-store.service";
import { PromptTemplateService } from "./services/prompt-template.service";
import { AiAuditService } from "./services/ai-audit.service";

@Injectable()
export class EnterpriseAiOsService {
  constructor(
    readonly agents: AgentRegistryService,
    readonly tasks: TaskRuntimeService,
    readonly memory: MemoryStoreService,
    readonly knowledge: KnowledgeGraphService,
    readonly workflows: WorkflowRuntimeService,
    readonly learning: LearningStoreService,
    readonly prompts: PromptTemplateService,
    private readonly audit: AiAuditService,
  ) {}

  record(
    action: string,
    entityId: string,
    metadata: Record<string, unknown> = {},
  ) {
    return this.audit.record(action, entityId, metadata);
  }
}
