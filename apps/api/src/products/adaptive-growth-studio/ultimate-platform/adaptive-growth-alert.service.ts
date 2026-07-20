import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthAlertService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
  ) {}

  raise(input: {
    severity: "warning" | "critical";
    source: string;
    message: string;
  }) {
    const alert = {
      id: this.ids.create("ags-alert"),
      severity: input.severity,
      source: input.source,
      message: input.message,
      acknowledged: false,
      createdAt: new Date().toISOString(),
    };

    this.store.alerts.set(alert.id, alert);
    return alert;
  }

  acknowledge(id: string) {
    const alert = this.store.alerts.get(id);
    if (!alert) {
      throw new Error(`Alert not found: ${id}`);
    }
    alert.acknowledged = true;
    return alert;
  }

  list() {
    return [...this.store.alerts.values()];
  }

  status() {
    return {
      status: "operational",
      total: this.store.alerts.size,
      active: this.list().filter((item) => !item.acknowledged).length,
    };
  }
}