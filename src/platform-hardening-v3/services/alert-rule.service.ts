import { Injectable } from "@nestjs/common";
import { AlertRuleStatus } from "../enums/alert-rule-status.enum";
import { IncidentSeverity } from "../enums/incident-severity.enum";
import { AlertRule } from "../interfaces/alert-rule.interface";
import { RequestMetricsService } from "./request-metrics.service";

@Injectable()
export class AlertRuleService {
  private readonly rules = new Map<string, AlertRule>();

  constructor(
    private readonly metrics:
      RequestMetricsService,
  ) {
    this.seedDefaultRules();
  }

  evaluateAll(): AlertRule[] {
    const snapshot = this.metrics.getSnapshot();

    const values: Record<string, number> = {
      errorRatePercent:
        snapshot.rates.errorRatePercent,
      slowRequestRatePercent:
        snapshot.rates.slowRequestRatePercent,
      averageLatencyMs:
        snapshot.latency.averageMs,
      maximumLatencyMs:
        snapshot.latency.maximumMs,
      totalFailedRequests:
        snapshot.totals.failedRequests,
    };

    for (const rule of this.rules.values()) {
      if (!rule.enabled) {
        rule.status = AlertRuleStatus.DISABLED;
        continue;
      }

      const currentValue =
        values[rule.metric] ?? 0;

      const triggered = this.compare(
        currentValue,
        rule.operator,
        rule.threshold,
      );

      rule.currentValue = currentValue;
      rule.lastEvaluatedAt =
        new Date().toISOString();
      rule.status = triggered
        ? AlertRuleStatus.TRIGGERED
        : AlertRuleStatus.HEALTHY;

      if (triggered) {
        rule.lastTriggeredAt =
          new Date().toISOString();
      }

      this.rules.set(rule.id, rule);
    }

    return this.findAll();
  }

  findAll(): AlertRule[] {
    return Array.from(this.rules.values())
      .map((item) => ({ ...item }))
      .sort((left, right) =>
        left.name.localeCompare(right.name),
      );
  }

  setEnabled(
    id: string,
    enabled: boolean,
  ): AlertRule | null {
    const rule = this.rules.get(id);

    if (!rule) {
      return null;
    }

    rule.enabled = enabled;
    rule.status = enabled
      ? AlertRuleStatus.HEALTHY
      : AlertRuleStatus.DISABLED;

    this.rules.set(id, rule);

    return { ...rule };
  }

  private seedDefaultRules(): void {
    const defaults: AlertRule[] = [
      {
        id: "high-error-rate",
        name: "High Error Rate",
        description:
          "Triggers when request error rate reaches 10 percent",
        metric: "errorRatePercent",
        operator: "gte",
        threshold: 10,
        severity: IncidentSeverity.ERROR,
        enabled: true,
        status: AlertRuleStatus.HEALTHY,
      },
      {
        id: "high-slow-request-rate",
        name: "High Slow Request Rate",
        description:
          "Triggers when slow request rate reaches 20 percent",
        metric: "slowRequestRatePercent",
        operator: "gte",
        threshold: 20,
        severity: IncidentSeverity.WARNING,
        enabled: true,
        status: AlertRuleStatus.HEALTHY,
      },
      {
        id: "high-average-latency",
        name: "High Average Latency",
        description:
          "Triggers when average request latency reaches 1000ms",
        metric: "averageLatencyMs",
        operator: "gte",
        threshold: 1000,
        severity: IncidentSeverity.WARNING,
        enabled: true,
        status: AlertRuleStatus.HEALTHY,
      },
      {
        id: "critical-maximum-latency",
        name: "Critical Maximum Latency",
        description:
          "Triggers when maximum request latency reaches 5000ms",
        metric: "maximumLatencyMs",
        operator: "gte",
        threshold: 5000,
        severity: IncidentSeverity.CRITICAL,
        enabled: true,
        status: AlertRuleStatus.HEALTHY,
      },
    ];

    for (const rule of defaults) {
      this.rules.set(rule.id, rule);
    }
  }

  private compare(
    currentValue: number,
    operator: AlertRule["operator"],
    threshold: number,
  ): boolean {
    switch (operator) {
      case "gt":
        return currentValue > threshold;
      case "gte":
        return currentValue >= threshold;
      case "lt":
        return currentValue < threshold;
      case "lte":
        return currentValue <= threshold;
      case "eq":
        return currentValue === threshold;
      default:
        return false;
    }
  }
}
