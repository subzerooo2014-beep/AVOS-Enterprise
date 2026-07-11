export declare class CreateAiTaskDto {
    title: string;
    description?: string;
    taskType: string;
    priority?: "low" | "normal" | "high" | "critical";
    requiredCapabilityCodes: string[];
    parentTaskId?: string;
    correlationId?: string;
    input?: Record<string, unknown>;
    requestedBy?: string;
}
