import { Injectable, NotFoundException } from "@nestjs/common";
import { AgentPolicy } from "../policies/agent.policy";
import { AiAgentRecord } from "../enterprise-ai-os.types";
import { aiOsId } from "../enterprise-ai-os.utils";
@Injectable()
export class AgentRegistryService {
  private readonly agents = new Map<string, AiAgentRecord>();
  constructor(private readonly policy: AgentPolicy) {}
  register(input: { code: string; name: string; capability: string; priority?: number }) {
    this.policy.validate(input.code, input.name, input.capability);
    const record: AiAgentRecord = {
      id: aiOsId("agent"),
      ...input,
      priority: input.priority ?? 50,
      active: true,
      createdAt: new Date().toISOString(),
    };
    this.agents.set(record.id, record);
    return record;
  }
  get(id: string) {
    const record = this.agents.get(id);
    if (!record) throw new NotFoundException(`Agent ${id} not found`);
    return record;
  }
  list() { return [...this.agents.values()]; }
}
