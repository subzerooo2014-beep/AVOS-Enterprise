import { Injectable } from "@nestjs/common";
import {
  OperationalIncident,
  RuntimeSignalDto,
} from "./dto/aeos-production.dto";

@Injectable()
export class AiIncidentDetectionService {
  detect(signal: RuntimeSignalDto): OperationalIncident[] {
    const incidents: OperationalIncident[] = [];
    const now = new Date().toISOString();

    if (signal.healthy === false) {
      incidents.push({
        id: `aeos-incident:${Date.now()}:health`,
        unit: signal.unit,
        severity: "critical",
        category: "health",
        summary: "Runtime health check reported an unhealthy unit.",
        detectedAt: now,
        evidence: { healthy: signal.healthy },
      });
    }

    if ((signal.errorRate ?? 0) > 0.05) {
      incidents.push({
        id: `aeos-incident:${Date.now()}:errors`,
        unit: signal.unit,
        severity: "critical",
        category: "error-rate",
        summary: "Error rate exceeded the production threshold.",
        detectedAt: now,
        evidence: { errorRate: signal.errorRate },
      });
    }

    if ((signal.capacityUsed ?? 0) > 0.85) {
      incidents.push({
        id: `aeos-incident:${Date.now()}:capacity`,
        unit: signal.unit,
        severity: "warning",
        category: "capacity",
        summary: "Capacity utilization is approaching exhaustion.",
        detectedAt: now,
        evidence: { capacityUsed: signal.capacityUsed },
      });
    }

    return incidents;
  }
}