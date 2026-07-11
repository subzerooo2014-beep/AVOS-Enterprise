import { SloStatus } from "../enums/slo-status.enum";
export interface SloObjective {
    id: string;
    name: string;
    description: string;
    metric: "availabilityPercent" | "errorRatePercent" | "averageLatencyMs" | "slowRequestRatePercent";
    comparison: "gte" | "lte";
    target: number;
    currentValue: number;
    status: SloStatus;
    errorBudgetRemainingPercent: number;
    evaluatedAt: string;
}
