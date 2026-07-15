import { Injectable } from '@nestjs/common';
import {
  AI_AGENT_OS_V2_CAPABILITIES,
  AiAgentOsDashboardSnapshot,
  AiAgentOsV2Capability,
} from './ai-agent-os-v2.types';

@Injectable()
export class AiAgentOsV2DashboardService {
  snapshot(
    input: Partial<AiAgentOsDashboardSnapshot> = {},
  ): AiAgentOsDashboardSnapshot {
    const clamp = (value: number) =>
      Math.max(0, Math.min(100, Math.round(value)));

    return {
      generatedAt: new Date().toISOString(),
      registeredCapabilities:
        input.registeredCapabilities ??
        AI_AGENT_OS_V2_CAPABILITIES.length,
      activeAgents: Math.max(0, input.activeAgents ?? 0),
      activeTools: Math.max(0, input.activeTools ?? 0),
      activeWorkflows: Math.max(0, input.activeWorkflows ?? 0),
      healthyCapabilities: Math.max(
        0,
        input.healthyCapabilities ?? 0,
      ),
      securityScore: clamp(input.securityScore ?? 100),
      reasoningScore: clamp(input.reasoningScore ?? 100),
      collaborationScore: clamp(input.collaborationScore ?? 100),
      platformScore: clamp(input.platformScore ?? 100),
      capabilityStatus: Object.fromEntries(
        AI_AGENT_OS_V2_CAPABILITIES.map(
          (capability: AiAgentOsV2Capability) => [
            capability,
            'operational',
          ],
        ),
      ) as AiAgentOsDashboardSnapshot['capabilityStatus'],
    };
  }
}