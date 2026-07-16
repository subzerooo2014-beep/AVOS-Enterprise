import { Injectable } from "@nestjs/common";
import { KernelDiagnosticSnapshot } from "../enterprise-kernel-mega-pack-4.types";
import { KernelHealthRegistryService } from "../registry/kernel-health-registry.service";
import { KernelFailureClassifierService } from "../failures/kernel-failure-classifier.service";
import { KernelDiagnosticsService } from "../diagnostics/kernel-diagnostics.service";
import { KernelIsolationService } from "../isolation/kernel-isolation.service";
import { KernelRecoveryService } from "../recovery/kernel-recovery.service";
import { KernelRestartPolicyService } from "../restart/kernel-restart-policy.service";
import { KernelOperationalModeService } from "../modes/kernel-operational-mode.service";
import { KernelResilienceAuditService } from "../observability/kernel-resilience-audit.service";

@Injectable()
export class KernelDiagnosticSnapshotService {
  private readonly snapshots = new Map<string, KernelDiagnosticSnapshot>();

  constructor(
    private readonly health: KernelHealthRegistryService,
    private readonly failures: KernelFailureClassifierService,
    private readonly diagnostics: KernelDiagnosticsService,
    private readonly isolations: KernelIsolationService,
    private readonly recovery: KernelRecoveryService,
    private readonly restart: KernelRestartPolicyService,
    private readonly modes: KernelOperationalModeService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  list() {
    return Array.from(this.snapshots.values());
  }

  create(input: {
    createdByIdentityId: string;
    correlationId: string;
  }) {
    const snapshot: KernelDiagnosticSnapshot = {
      id: `kernel-diagnostic-snapshot:${Date.now()}:${this.snapshots.size + 1}`,
      mode: this.modes.current().mode,
      healthRecords: JSON.parse(JSON.stringify(this.health.listRecords())),
      failures: JSON.parse(JSON.stringify(this.failures.list())),
      findings: JSON.parse(JSON.stringify(this.diagnostics.list())),
      isolations: JSON.parse(JSON.stringify(this.isolations.list())),
      recoveryPlans: JSON.parse(JSON.stringify(this.recovery.list())),
      restartAttempts: JSON.parse(JSON.stringify(this.restart.listAttempts())),
      createdByIdentityId: input.createdByIdentityId,
      correlationId: input.correlationId,
      createdAt: new Date().toISOString()
    };

    this.snapshots.set(snapshot.id, snapshot);

    this.audit.record({
      correlationId: input.correlationId,
      category: "snapshot",
      action: "kernel-diagnostic-snapshot-created",
      subjectId: snapshot.id,
      actorIdentityId: input.createdByIdentityId,
      outcome: "success",
      metadata: {
        mode: snapshot.mode,
        healthRecords: snapshot.healthRecords.length,
        failures: snapshot.failures.length
      }
    });

    return snapshot;
  }

  summary() {
    return {
      total: this.snapshots.size
    };
  }
}
