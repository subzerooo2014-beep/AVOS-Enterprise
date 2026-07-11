export declare class CreateAiCapabilityDto {
    name: string;
    code: string;
    description?: string;
    category: "reasoning" | "planning" | "analysis" | "automation" | "retrieval" | "generation" | "security" | "governance" | "operations" | "communication";
    requiresApproval?: boolean;
    riskLevel?: "low" | "medium" | "high" | "critical";
    maximumExecutionSeconds?: number;
    allowedEnvironments?: string[];
}
