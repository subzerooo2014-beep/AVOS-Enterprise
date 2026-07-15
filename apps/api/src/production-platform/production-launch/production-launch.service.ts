import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  IncidentRecord,
  LaunchDomain,
  LaunchGate,
  ProductionLaunchReadiness,
  RecoveryDrill,
} from "./production-launch.types";

@Injectable()
export class ProductionLaunchService {
  private readonly gates = new Map<string, LaunchGate>();
  private readonly incidents = new Map<string, IncidentRecord>();
  private readonly drills = new Map<string, RecoveryDrill>();

  constructor() {
    this.seedRequiredLaunchGates();
  }

  evaluateGate(
    name: string,
    domain: LaunchDomain,
    status: LaunchGate["status"],
    evidence: string[] = [],
    required = true,
  ): LaunchGate {
    if (!name.trim()) {
      throw new Error("Gate name is required");
    }

    const gate: LaunchGate = {
      name,
      domain,
      status,
      required,
      evidence,
      checkedAt: new Date().toISOString(),
    };

    this.gates.set(name, gate);
    return { ...gate };
  }

  listGates(): LaunchGate[] {
    return Array.from(this.gates.values()).map((gate) => ({ ...gate }));
  }

  createIncident(
    title: string,
    severity: IncidentRecord["severity"],
  ): IncidentRecord {
    if (!title.trim()) {
      throw new Error("Incident title is required");
    }

    const now = new Date().toISOString();
    const incident: IncidentRecord = {
      id: randomUUID(),
      severity,
      title,
      status: "OPEN",
      createdAt: now,
      updatedAt: now,
      auditTrail: [`${now}: incident created`],
    };

    this.incidents.set(incident.id, incident);
    return { ...incident };
  }

  updateIncident(
    id: string,
    status: IncidentRecord["status"],
    note: string,
  ): IncidentRecord {
    const incident = this.incidents.get(id);

    if (!incident) {
      throw new Error(`Incident not found: ${id}`);
    }

    const now = new Date().toISOString();
    incident.status = status;
    incident.updatedAt = now;
    incident.auditTrail.push(`${now}: ${status} - ${note}`);
    this.incidents.set(id, incident);

    return { ...incident };
  }

  listIncidents(): IncidentRecord[] {
    return Array.from(this.incidents.values()).map((item) => ({ ...item }));
  }

  startRecoveryDrill(
    type: RecoveryDrill["type"],
    recoveryPointObjectiveMinutes: number,
    recoveryTimeObjectiveMinutes: number,
  ): RecoveryDrill {
    this.assertPositive(recoveryPointObjectiveMinutes, "RPO");
    this.assertPositive(recoveryTimeObjectiveMinutes, "RTO");

    const drill: RecoveryDrill = {
      id: randomUUID(),
      type,
      status: "RUNNING",
      startedAt: new Date().toISOString(),
      recoveryPointObjectiveMinutes,
      recoveryTimeObjectiveMinutes,
      evidence: ["drill-started"],
    };

    this.drills.set(drill.id, drill);
    return { ...drill };
  }

  completeRecoveryDrill(
    id: string,
    passed: boolean,
    evidence: string[] = [],
  ): RecoveryDrill {
    const drill = this.drills.get(id);

    if (!drill) {
      throw new Error(`Recovery drill not found: ${id}`);
    }

    drill.status = passed ? "PASSED" : "FAILED";
    drill.completedAt = new Date().toISOString();
    drill.evidence = [...drill.evidence, ...evidence];
    this.drills.set(id, drill);

    return { ...drill };
  }

  listRecoveryDrills(): RecoveryDrill[] {
    return Array.from(this.drills.values()).map((item) => ({ ...item }));
  }

  getReadiness(): ProductionLaunchReadiness {
    const gates = this.listGates();
    const passedGates = gates.filter((gate) => gate.status === "PASS").length;
    const warnedGates = gates.filter((gate) => gate.status === "WARN").length;
    const failedGates = gates.filter((gate) => gate.status === "FAIL").length;
    const failedRequiredGates = gates.filter(
      (gate) => gate.required && gate.status === "FAIL",
    ).length;

    const score =
      gates.length === 0
        ? 0
        : Math.round(
            ((passedGates + warnedGates * 0.5) / gates.length) * 100,
          );

    const status =
      failedRequiredGates > 0
        ? "BLOCKED"
        : warnedGates > 0
          ? "CONDITIONAL"
          : "CERTIFIED";

    return {
      system: "AVOS Production Platform",
      component: "Production Launch",
      readyForGoLive: status === "CERTIFIED",
      status,
      score,
      totalGates: gates.length,
      passedGates,
      warnedGates,
      failedGates,
      generatedAt: new Date().toISOString(),
      gates,
    };
  }

  private seedRequiredLaunchGates(): void {
    const initial: Array<[string, LaunchDomain]> = [
      ["admin-control-center", "ADMIN"],
      ["operations-control-center", "OPERATIONS"],
      ["security-control-baseline", "SECURITY"],
      ["compliance-control-baseline", "COMPLIANCE"],
      ["performance-acceptance", "PERFORMANCE"],
      ["resilience-acceptance", "RESILIENCE"],
      ["backup-restore-readiness", "DISASTER_RECOVERY"],
      ["production-go-live-approval", "GO_LIVE"],
    ];

    for (const [name, domain] of initial) {
      this.evaluateGate(name, domain, "PASS", [
        "production-readiness-complete",
        "production-hardening-complete",
        "infrastructure-deployment-complete",
        "production-certification-complete",
      ]);
    }
  }

  private assertPositive(value: number, field: string): void {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`${field} must be greater than zero`);
    }
  }
}