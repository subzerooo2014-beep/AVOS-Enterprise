import { Injectable } from "@nestjs/common";
import { IntelligenceAgentRegistryV2Service } from "./intelligence-agent-registry-v2.service";
import type { AgentCollaborationV2 } from "./autonomous-intelligence-v2.types";

@Injectable()
export class MultiAgentCollaborationV2Service {
  private readonly messages: AgentCollaborationV2[] = [];

  constructor(private readonly agents: IntelligenceAgentRegistryV2Service) {}

  send(
    senderId: string,
    receiverId: string,
    topic: string,
    payload: Record<string, unknown>,
  ): AgentCollaborationV2 {
    this.agents.get(senderId);
    this.agents.get(receiverId);

    const message: AgentCollaborationV2 = {
      id: `agent-collaboration-v2-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      senderId,
      receiverId,
      topic,
      payload: { ...payload },
      createdAt: new Date().toISOString(),
    };

    this.messages.unshift(message);
    return this.clone(message);
  }

  list(): AgentCollaborationV2[] {
    return this.messages.map((message) => this.clone(message));
  }

  count(): number {
    return this.messages.length;
  }

  private clone(message: AgentCollaborationV2): AgentCollaborationV2 {
    return { ...message, payload: { ...message.payload } };
  }
}
