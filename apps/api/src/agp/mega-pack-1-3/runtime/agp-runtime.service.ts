import { Injectable } from "@nestjs/common";
import { AgpRuntimeState } from "../contracts/agp-runtime.contracts";

@Injectable()
export class AgpRuntimeService {
  private state: AgpRuntimeState = {
    name: "AVOS Growth Platform",
    version: "AGP-MP1-3-1.0.0",
    status: "created",
    environment: process.env.NODE_ENV ?? "development",
    featureFlags: {
      strategyPlatform: true,
      growthIntelligence: true,
      opportunityRadar: true,
      growthMemory: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
    },
    metrics: {
      boots: 0,
      strategies: 0,
      opportunities: 0,
      recommendations: 0,
      decisions: 0,
      events: 0,
    },
  };

  boot(): AgpRuntimeState {
    this.state = {
      ...this.state,
      status: "operational",
      bootedAt: new Date().toISOString(),
      stoppedAt: undefined,
      metrics: {
        ...this.state.metrics,
        boots: this.state.metrics.boots + 1,
      },
    };

    return this.snapshot();
  }

  stop(): AgpRuntimeState {
    this.state = {
      ...this.state,
      status: "stopped",
      stoppedAt: new Date().toISOString(),
    };

    return this.snapshot();
  }

  increment(metric: keyof AgpRuntimeState["metrics"], value = 1): void {
    this.state.metrics[metric] = (this.state.metrics[metric] ?? 0) + value;
  }

  setFeatureFlag(name: string, enabled: boolean): AgpRuntimeState {
    this.state.featureFlags[name] = enabled;
    return this.snapshot();
  }

  snapshot(): AgpRuntimeState {
    return JSON.parse(JSON.stringify(this.state)) as AgpRuntimeState;
  }
}