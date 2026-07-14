import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseAnomaly,
  EnterpriseAnomalySeverity,
} from "./enterprise-e6.types";

@Injectable()
export class EnterpriseAnomalyDetectionService {
  private readonly anomalies = new Map<string, EnterpriseAnomaly>();

  detect(input: {
    source?: string;
    code?: string;
    severity?: EnterpriseAnomalySeverity;
    details?: Record<string, unknown>;
  }): EnterpriseAnomaly {
    const anomaly: EnterpriseAnomaly = {
      id: randomUUID(),
      source: input.source?.trim() || "enterprise-e6",
      code: input.code?.trim() || "AUTONOMOUS_RUNTIME_ANOMALY",
      severity: input.severity || "MEDIUM",
      details: input.details || {},
      detectedAt: new Date().toISOString(),
    };

    this.anomalies.set(anomaly.id, anomaly);
    return anomaly;
  }

  list(): EnterpriseAnomaly[] {
    return [...this.anomalies.values()];
  }

  count(): number {
    return this.anomalies.size;
  }
}