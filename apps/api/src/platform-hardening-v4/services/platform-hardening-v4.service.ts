import { Injectable } from "@nestjs/common";
import { ResilienceStateService } from "./resilience-state.service";
import { SloManagementService } from "./slo-management.service";
import { TrafficProtectionService } from "./traffic-protection.service";

@Injectable()
export class PlatformHardeningV4Service {
  constructor(
    private readonly resilience:
      ResilienceStateService,
    private readonly traffic:
      TrafficProtectionService,
    private readonly slo:
      SloManagementService,
  ) {}

  getStatus() {
    return {
      success: true,
      system: "AVOS Platform Hardening",
      version: "v4",
      phase:
        "resilience-slo-and-traffic-protection",
      environment:
        process.env.NODE_ENV ?? "development",
      capabilities: {
        requestRateProtection: true,
        concurrencyProtection: true,
        loadShedding: true,
        maintenanceMode: true,
        brownoutMode: true,
        emergencyMode: true,
        serviceLevelObjectives: true,
        errorBudgetTracking: true,
        runtimeTrafficPolicies: true,
        protectedDiagnostics: true,
      },
      resilience:
        this.resilience.getSnapshot(),
      timestamp: new Date().toISOString(),
      uptimeSeconds: Number(
        process.uptime().toFixed(3),
      ),
    };
  }

  getSnapshot() {
    return {
      success: true,
      system:
        "AVOS Enterprise Production",
      hardeningVersion: "v4",
      generatedAt:
        new Date().toISOString(),
      resilience:
        this.resilience.getSnapshot(),
      traffic: {
        policy: this.traffic.getPolicy(),
        state: this.traffic.getState(),
      },
      slo: this.slo.getSummary(),
      recentEvents:
        this.resilience.getRecentEvents(25),
    };
  }
}
