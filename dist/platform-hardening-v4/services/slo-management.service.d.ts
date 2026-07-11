import { SloObjective } from "../interfaces/slo-objective.interface";
import { RequestMetricsService } from "../../platform-hardening-v3/services/request-metrics.service";
export declare class SloManagementService {
    private readonly metrics;
    constructor(metrics: RequestMetricsService);
    evaluate(): SloObjective[];
    getSummary(): {
        total: number;
        healthy: number;
        atRisk: number;
        breached: number;
        minimumErrorBudgetRemainingPercent: number;
        objectives: SloObjective[];
    };
    private buildObjective;
    private calculateViolationPercent;
    private calculateErrorBudgetRemainingPercent;
    private clamp;
}
