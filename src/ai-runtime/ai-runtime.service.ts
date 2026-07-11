import { Injectable } from "@nestjs/common";
import { AgentRegistryService } from "./agents/agent-registry.service";

@Injectable()
export class AiRuntimeService {
  constructor(private readonly registry: AgentRegistryService) {}

  async run(taskType: string, input: any) {
    const agent = this.registry.find(taskType);

    if (!agent) {
      return {
        status: "failed",
        output: null,
        confidence: 0,
        reason: `No agent registered for ${taskType}`,
      };
    }

    return agent.execute(input);
  }
}
