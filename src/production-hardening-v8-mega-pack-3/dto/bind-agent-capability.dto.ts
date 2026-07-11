export class BindAgentCapabilityDto {
  agentId!: string;
  capabilityId!: string;
  priorityWeight?: number;
  maximumConcurrentExecutions?: number;
}
