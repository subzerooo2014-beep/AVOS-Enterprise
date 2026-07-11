import { Module } from "@nestjs/common";
import { AiRuntimeService } from "./ai-runtime.service";
import { AgentRegistryService } from "./agents/agent-registry.service";

@Module({
  providers: [AiRuntimeService, AgentRegistryService],
  exports: [AiRuntimeService],
})
export class AiRuntimeModule {}
