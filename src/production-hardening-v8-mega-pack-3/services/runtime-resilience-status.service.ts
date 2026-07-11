import { Injectable } from "@nestjs/common";
import {
  RuntimeResilienceSnapshot,
} from "../contracts/runtime-resilience.contracts";
import {
  ResilienceActionStatus,
  ResilienceConfigurationStatus,
  ResiliencePolicyStatus,
  RuntimeDecision,
  RuntimeIncidentStatus,
  RuntimeSignalStatus,
} from "../contracts/runtime-resilience.enums";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "./runtime-evidence-chain.service";

@Injectable()
export class RuntimeResilienceStatusService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence: RuntimeEvidenceChainService,
  ) {}

  snapshot(): RuntimeResilienceSnapshot {
    const configurations =
      this.store.listConfigurations();

    const policies =
      this.store.listPolicies();

    const riskEvaluations =
      this.store.listRiskEvaluations();

    const signals =
      this.store.listSignals();

    const incidents =
      this.store.listIncidents();

    const actions =
      this.store.listActions();

    const baselines =
      this.store.listBaselines();

    const integrity =
      this.evidence.verify();

    const unhealthySignals =
      signals.filter(
        (signal) =>
          signal.status ===
          RuntimeSignalStatus.UNHEALTHY,
      ).length;

    const degradedSignals =
      signals.filter(
        (signal) =>
          signal.status ===
          RuntimeSignalStatus.DEGRADED,
      ).length;

    const openIncidents =
      incidents.filter(
        (incident) =>
          ![
            RuntimeIncidentStatus.RESOLVED,
            RuntimeIncidentStatus.CLOSED,
          ].includes(incident.status),
      ).length;

    const failedActions =
      actions.filter(
        (action) =>
          action.status ===
          ResilienceActionStatus.FAILED,
      ).length;

    const runningActions =
      actions.filter(
        (action) =>
          action.status ===
          ResilienceActionStatus.RUNNING,
      ).length;

    const blockedEvaluations =
      riskEvaluations.filter(
        (evaluation) =>
          evaluation.decision ===
            RuntimeDecision.BLOCK ||
          evaluation.decision ===
            RuntimeDecision.EMERGENCY_ROLLBACK,
      ).length;

    let healthStatus:
      | "healthy"
      | "degraded"
      | "unhealthy" = "healthy";

    if (
      !integrity.valid ||
      unhealthySignals > 0 ||
      failedActions > 0
    ) {
      healthStatus = "unhealthy";
    } else if (
      degradedSignals > 0 ||
      openIncidents > 0 ||
      runningActions > 0
    ) {
      healthStatus = "degraded";
    }

    return {
      generatedAt: new Date().toISOString(),
      system:
        "AVOS Production Hardening V8 — Mega Pack 3",
      version: "v8-mega-pack-3",
      healthStatus,
      evidenceChainVerified: integrity.valid,
      controlMode: this.store.getControlMode(),

      configurations: configurations.length,

      activeConfigurations:
        configurations.filter(
          (configuration) =>
            configuration.status ===
            ResilienceConfigurationStatus.ACTIVE,
        ).length,

      pendingApprovals:
        configurations.filter(
          (configuration) =>
            configuration.status ===
            ResilienceConfigurationStatus.PENDING_APPROVAL,
        ).length,

      policies: policies.length,

      activePolicies:
        policies.filter(
          (policy) =>
            policy.status ===
            ResiliencePolicyStatus.ACTIVE,
        ).length,

      riskEvaluations:
        riskEvaluations.length,

      blockedEvaluations,

      signals:
        signals.length,

      unhealthySignals,

      incidents:
        incidents.length,

      openIncidents,

      actions:
        actions.length,

      runningActions,

      failedActions,

      baselines:
        baselines.length,

      activeBaselines:
        baselines.filter(
          (baseline) => baseline.active,
        ).length,

      evidenceEntries:
        this.store.listEvidenceEntries().length,
    };
  }

  health(): {
    success: boolean;
    system: string;
    version: string;
    healthStatus:
      | "healthy"
      | "degraded"
      | "unhealthy";
    evidenceChainVerified: boolean;
    controlMode: string;
    generatedAt: string;
  } {
    const snapshot = this.snapshot();

    return {
      success:
        snapshot.healthStatus !== "unhealthy" &&
        snapshot.evidenceChainVerified,
      system: snapshot.system,
      version: snapshot.version,
      healthStatus: snapshot.healthStatus,
      evidenceChainVerified:
        snapshot.evidenceChainVerified,
      controlMode: snapshot.controlMode,
      generatedAt: snapshot.generatedAt,
    };
  }
}
