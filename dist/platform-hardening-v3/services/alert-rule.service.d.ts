import { AlertRule } from "../interfaces/alert-rule.interface";
import { RequestMetricsService } from "./request-metrics.service";
export declare class AlertRuleService {
    private readonly metrics;
    private readonly rules;
    constructor(metrics: RequestMetricsService);
    evaluateAll(): AlertRule[];
    findAll(): AlertRule[];
    setEnabled(id: string, enabled: boolean): AlertRule | null;
    private seedDefaultRules;
    private compare;
}
