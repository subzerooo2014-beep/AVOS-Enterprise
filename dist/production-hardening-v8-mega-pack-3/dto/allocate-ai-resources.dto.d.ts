export declare class AllocateAiResourcesDto {
    agentId: string;
    taskId?: string;
    cpuUnits?: number;
    memoryMb?: number;
    tokenBudget?: number;
    executionTimeoutSeconds?: number;
    priorityWeight?: number;
}
