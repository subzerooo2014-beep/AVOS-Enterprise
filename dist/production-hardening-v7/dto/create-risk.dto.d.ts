export declare class CreateRiskDto {
    riskCode: string;
    title: string;
    description: string;
    category: string;
    owner: string;
    likelihood: number;
    impact: number;
    residualScore?: number;
    status?: "identified" | "assessed" | "mitigating" | "accepted" | "transferred" | "closed";
    controls?: string[];
    treatmentPlan?: string;
    reviewDate?: string;
    metadata?: Record<string, unknown>;
}
