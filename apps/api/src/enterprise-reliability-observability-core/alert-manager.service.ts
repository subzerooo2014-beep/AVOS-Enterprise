import { Injectable, NotFoundException } from "@nestjs/common";
import type {
  AlertRecord,
  AlertRuleRecord,
} from "./reliability-observability.types";

@Injectable()
export class AlertManagerService {
  private readonly rules = new Map<string, AlertRuleRecord>();
  private readonly alerts = new Map<string, AlertRecord>();

  registerRule(rule: AlertRuleRecord): AlertRuleRecord {
    this.rules.set(rule.id, { ...rule });
    return { ...rule };
  }

  evaluate(metric: string, value: number): AlertRecord[] {
    const triggered: AlertRecord[] = [];

    for (const rule of this.rules.values()) {
      if (!rule.enabled || rule.metric !== metric) {
        continue;
      }

      if (this.matches(rule, value)) {
        const alert: AlertRecord = {
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          ruleId: rule.id,
          metric,
          value,
          severity: rule.severity,
          status: "OPEN",
          createdAt: new Date().toISOString(),
        };

        this.alerts.set(alert.id, alert);
        triggered.push({ ...alert });
      }
    }

    return triggered;
  }

  acknowledge(id: string): AlertRecord {
    const alert = this.requireAlert(id);
    alert.status = "ACKNOWLEDGED";
    return { ...alert };
  }

  resolve(id: string): AlertRecord {
    const alert = this.requireAlert(id);
    alert.status = "RESOLVED";
    alert.resolvedAt = new Date().toISOString();
    return { ...alert };
  }

  rulesList(): AlertRuleRecord[] {
    return Array.from(this.rules.values()).map((rule) => ({ ...rule }));
  }

  alertsList(): AlertRecord[] {
    return Array.from(this.alerts.values()).map((alert) => ({ ...alert }));
  }

  openCount(): number {
    return this.alertsList().filter((alert) => alert.status !== "RESOLVED")
      .length;
  }

  private requireAlert(id: string): AlertRecord {
    const alert = this.alerts.get(id);

    if (!alert) {
      throw new NotFoundException(`Alert '${id}' was not found.`);
    }

    return alert;
  }

  private matches(rule: AlertRuleRecord, value: number): boolean {
    if (rule.operator === "GT") return value > rule.threshold;
    if (rule.operator === "GTE") return value >= rule.threshold;
    if (rule.operator === "LT") return value < rule.threshold;
    if (rule.operator === "LTE") return value <= rule.threshold;
    return value === rule.threshold;
  }
}
