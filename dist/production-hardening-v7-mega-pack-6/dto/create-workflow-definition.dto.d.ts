export declare class CreateWorkflowStepDto {
    name: string;
    stepType: "action" | "approval" | "condition" | "notification" | "delay" | "evidence" | "remediation";
    handler: string;
    order: number;
    timeoutSeconds?: number;
    retryLimit?: number;
    continueOnFailure?: boolean;
    configuration?: Record<string, unknown>;
}
export declare class CreateWorkflowDefinitionDto {
    workflowCode: string;
    name: string;
    description: string;
    triggerType: string;
    version?: number;
    enabled?: boolean;
    steps: CreateWorkflowStepDto[];
    metadata?: Record<string, unknown>;
}
