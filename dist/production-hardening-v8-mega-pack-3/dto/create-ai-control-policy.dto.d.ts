export declare class CreateAiControlPolicyDto {
    name: string;
    description?: string;
    environment?: string;
    protectedAgentCodes?: string[];
    blockedCapabilityCodes?: string[];
    approvalRequiredCapabilityCodes?: string[];
    minimumConfidencePercent?: number;
    maximumConcurrentTasksPerAgent?: number;
    maximumExecutionSeconds?: number;
    allowCrossAgentDelegation?: boolean;
}
