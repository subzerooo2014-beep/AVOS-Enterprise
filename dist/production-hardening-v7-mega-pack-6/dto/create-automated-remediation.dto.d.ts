export declare class CreateAutomatedRemediationActionDto {
    name: string;
    handler: string;
    order: number;
    requiresApproval?: boolean;
    retryLimit?: number;
    configuration?: Record<string, unknown>;
}
export declare class CreateAutomatedRemediationDto {
    sourceType: string;
    sourceId: string;
    title: string;
    description: string;
    severity: "informational" | "low" | "medium" | "high" | "critical";
    owner: string;
    priority: number;
    dueAt?: string;
    actions: CreateAutomatedRemediationActionDto[];
    metadata?: Record<string, unknown>;
}
