export declare class CreateAiSafetyDecisionDto {
    agentId: string;
    taskId?: string;
    decision: "safe" | "restricted" | "blocked" | "human_review";
    riskScore: number;
    reasons?: string[];
}
