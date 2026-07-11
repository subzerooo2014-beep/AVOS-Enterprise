import { AlertRuleStatus } from "../enums/alert-rule-status.enum";
import { IncidentSeverity } from "../enums/incident-severity.enum";
export interface AlertRule {
    id: string;
    name: string;
    description: string;
    metric: string;
    operator: "gt" | "gte" | "lt" | "lte" | "eq";
    threshold: number;
    severity: IncidentSeverity;
    enabled: boolean;
    status: AlertRuleStatus;
    lastEvaluatedAt?: string;
    lastTriggeredAt?: string;
    currentValue?: number;
}
