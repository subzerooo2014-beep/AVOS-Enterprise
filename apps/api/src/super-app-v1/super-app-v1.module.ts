import { Module } from "@nestjs/common";
import { SuperAppV1Controller } from "./super-app-v1.controller";
import { SuperAppAgentsService } from "./super-app-v1.agents.service";
import { SuperAppMemoryService } from "./super-app-v1.memory.service";
import { SuperAppOrchestratorService } from "./super-app-v1.orchestrator.service";
import { SuperAppWorkflowService } from "./super-app-v1.workflow.service";

@Module({
  controllers: [SuperAppV1Controller],
  providers: [
    SuperAppMemoryService,
    SuperAppAgentsService,
    SuperAppWorkflowService,
    SuperAppOrchestratorService,
  ],
  exports: [
    SuperAppMemoryService,
    SuperAppAgentsService,
    SuperAppWorkflowService,
    SuperAppOrchestratorService,
  ],
})
export class SuperAppV1Module {}