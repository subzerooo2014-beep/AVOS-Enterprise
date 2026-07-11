export declare class CreateRiskTreatmentTaskDto {
    title: string;
    description: string;
    owner: string;
    priority: number;
    dueAt?: string;
    dependencies?: string[];
}
export declare class CreateRiskTreatmentDto {
    riskId: string;
    riskCode?: string;
    title: string;
    description: string;
    strategy: "avoid" | "mitigate" | "transfer" | "accept" | "monitor";
    owner: string;
    targetResidualScore: number;
    tasks?: CreateRiskTreatmentTaskDto[];
    metadata?: Record<string, unknown>;
}
