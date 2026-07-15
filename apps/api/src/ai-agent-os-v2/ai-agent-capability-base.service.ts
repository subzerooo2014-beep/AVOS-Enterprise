import {
  AgentCapabilityHealth,
  AgentCapabilityRecord,
  AgentExecutionResult,
  AiAgentOsV2Capability,
} from './ai-agent-os-v2.types';

export abstract class AiAgentCapabilityBaseService {
  protected readonly records = new Map<string, AgentCapabilityRecord>();

  constructor(public readonly capability: AiAgentOsV2Capability) {}

  register(
    record: Omit<AgentCapabilityRecord, 'capability'>,
  ): AgentCapabilityRecord {
    const stored: AgentCapabilityRecord = {
      ...record,
      capability: this.capability,
      status: record.enabled ? 'active' : 'registered',
    };

    this.records.set(stored.id, stored);
    return { ...stored, metadata: { ...stored.metadata } };
  }

  execute(
    action: string,
    payload: Record<string, unknown> = {},
  ): AgentExecutionResult {
    const active = [...this.records.values()].filter(
      (record) => record.status === 'active',
    ).length;

    return {
      capability: this.capability,
      success: true,
      score: Math.min(100, 90 + Math.min(10, active)),
      status: action,
      timestamp: new Date().toISOString(),
      details: {
        action,
        payload,
        activeRecords: active,
        registeredRecords: this.records.size,
      },
    };
  }

  health(): AgentCapabilityHealth {
    return {
      capability: this.capability,
      registered: this.records.size,
      active: [...this.records.values()].filter(
        (record) => record.status === 'active',
      ).length,
      healthy: true,
    };
  }
}