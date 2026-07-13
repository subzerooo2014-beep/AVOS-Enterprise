import { Injectable } from "@nestjs/common";
import type { FlowAnomaly } from "./core-flow-intelligence.types";

@Injectable()
export class CoreFlowAnomalyService {
  private readonly anomalies: FlowAnomaly[] = [];

  detect(
    executionId: string,
    metric: string,
    actual: number,
    expected: number,
  ) {
    const normalizedExpected = Math.max(Math.abs(Number(expected || 0)), 1);
    const deviation = Number(
      (((Number(actual || 0) - Number(expected || 0)) / normalizedExpected) * 100).toFixed(2),
    );

    const severity: FlowAnomaly["severity"] =
      Math.abs(deviation) >= 100
        ? "critical"
        : Math.abs(deviation) >= 50
          ? "high"
          : Math.abs(deviation) >= 25
            ? "medium"
            : "low";

    const anomaly: FlowAnomaly = {
      id: `anomaly_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      executionId,
      metric,
      actual: Number(actual || 0),
      expected: Number(expected || 0),
      deviation,
      severity,
      detectedAt: new Date().toISOString(),
    };

    this.anomalies.push(anomaly);
    return anomaly;
  }

  findAll(query: any = {}) {
    return this.anomalies
      .filter((item) => !query.executionId || item.executionId === query.executionId)
      .filter((item) => !query.severity || item.severity === query.severity)
      .slice()
      .reverse();
  }

  dashboard() {
    const count = (severity: FlowAnomaly["severity"]) =>
      this.anomalies.filter((item) => item.severity === severity).length;

    return {
      total: this.anomalies.length,
      low: count("low"),
      medium: count("medium"),
      high: count("high"),
      critical: count("critical"),
      generatedAt: new Date().toISOString(),
    };
  }
}
