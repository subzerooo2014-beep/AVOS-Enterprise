import { Injectable } from "@nestjs/common";
import { OperationsHealthCenterV1Service } from "./operations-health-center-v1.service";
import { OperationsIncidentManagerV1Service } from "./operations-incident-manager-v1.service";
import type { OperationsDiagnosticV1 } from "./enterprise-operations-platform-v1.types";

@Injectable()
export class OperationsDiagnosticsV1Service {
  private readonly diagnostics: OperationsDiagnosticV1[] = [];

  constructor(
    private readonly health: OperationsHealthCenterV1Service,
    private readonly incidents: OperationsIncidentManagerV1Service,
  ) {}

  run(): OperationsDiagnosticV1 {
    const findings: string[] = [];
    let status: OperationsDiagnosticV1["status"] = "PASS";

    if (this.health.unhealthyCount() > 0) {
      findings.push(`unhealthyServices=${this.health.unhealthyCount()}`);
      status = "FAIL";
    }

    if (this.health.degradedCount() > 0 && status === "PASS") {
      findings.push(`degradedServices=${this.health.degradedCount()}`);
      status = "WARN";
    }

    if (this.incidents.criticalCount() > 0) {
      findings.push(`criticalIncidents=${this.incidents.criticalCount()}`);
      status = "FAIL";
    }

    findings.push(`services=${this.health.count()}`);
    findings.push(`incidents=${this.incidents.count()}`);

    const diagnostic: OperationsDiagnosticV1 = {
      id: `operations-diagnostic-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      category: "ENTERPRISE_OPERATIONS",
      status,
      findings,
      createdAt: new Date().toISOString(),
    };

    this.diagnostics.unshift(diagnostic);
    return this.clone(diagnostic);
  }

  list(): OperationsDiagnosticV1[] {
    return this.diagnostics.map((item) => this.clone(item));
  }

  count(): number {
    return this.diagnostics.length;
  }

  failedCount(): number {
    return this.diagnostics.filter((item) => item.status === "FAIL").length;
  }

  private clone(item: OperationsDiagnosticV1): OperationsDiagnosticV1 {
    return { ...item, findings: [...item.findings] };
  }
}
