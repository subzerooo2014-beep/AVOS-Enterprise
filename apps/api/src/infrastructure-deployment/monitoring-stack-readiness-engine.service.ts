import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitoringStackReadinessEngineService {
  evaluate(input: {
    prometheusConfigured: boolean;
    grafanaConfigured: boolean;
    serviceMetrics: boolean;
    infrastructureMetrics: boolean;
    alertsConfigured: boolean;
    dashboardsProvisioned: boolean;
  }) {
    const checks = Object.values(input);
    const score = Math.round(
      (checks.filter(Boolean).length / checks.length) * 100,
    );

    return {
      ...input,
      score,
      ready: score === 100,
    };
  }
}