import { Injectable } from "@nestjs/common";
@Injectable()
export class FleetAlertService {
  private readonly alerts: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const alert = { id: `alert_${Date.now()}`, ...input, status: "OPEN", createdAt: new Date().toISOString() };
    this.alerts.push(alert);
    return alert;
  }
  list() { return [...this.alerts]; }
}
