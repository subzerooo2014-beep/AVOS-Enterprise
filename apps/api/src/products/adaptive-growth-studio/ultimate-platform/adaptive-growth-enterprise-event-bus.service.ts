import { Injectable } from "@nestjs/common";
import { AdaptiveGrowthUltimateIdService } from "./adaptive-growth-ultimate-id.service";
import { AdaptiveGrowthUltimateStoreService } from "./adaptive-growth-ultimate-store.service";

@Injectable()
export class AdaptiveGrowthEnterpriseEventBusService {
  constructor(
    private readonly ids: AdaptiveGrowthUltimateIdService,
    private readonly store: AdaptiveGrowthUltimateStoreService,
  ) {}

  publish(input: {
    type: string;
    source: string;
    correlationId?: string;
    severity?: "debug" | "info" | "warning" | "error" | "critical";
    data?: Record<string, unknown>;
  }) {
    const event = {
      id: this.ids.create("ags-event"),
      type: input.type,
      source: input.source,
      correlationId: input.correlationId,
      severity: input.severity ?? "info",
      data: input.data ?? {},
      timestamp: new Date().toISOString(),
    };

    this.store.telemetry.unshift(event);
    return event;
  }

  list(limit = 100) {
    return this.store.telemetry.slice(0, limit);
  }

  status() {
    return {
      status: "operational",
      events: this.store.telemetry.length,
      enterpriseNervousSystemReady: true,
      realTimeFoundation: true,
    };
  }
}