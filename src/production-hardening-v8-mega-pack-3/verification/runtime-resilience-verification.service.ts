import { Injectable } from "@nestjs/common";
import {
  RuntimeResilienceSnapshot,
} from "../contracts/runtime-resilience.contracts";
import {
  ResilienceConfigurationStatus,
  ResiliencePolicyStatus,
  RuntimeSignalStatus,
} from "../contracts/runtime-resilience.enums";
import { RuntimeResilienceStore } from "../stores/runtime-resilience.store";
import { RuntimeEvidenceChainService } from "../services/runtime-evidence-chain.service";
import { RuntimeResilienceStatusService } from "../services/runtime-resilience-status.service";

export interface RuntimeVerificationCheck {
  name: string;
  success: boolean;
  expected: unknown;
  actual: unknown;
}

export interface RuntimeVerificationResult {
  success: boolean;
  system: string;
  version: string;
  healthStatus: string;
  evidenceChainVerified: boolean;
  checksPassed: number;
  checksFailed: number;
  checks: RuntimeVerificationCheck[];
  snapshot: RuntimeResilienceSnapshot;
  verifiedAt: string;
}

@Injectable()
export class RuntimeResilienceVerificationService {
  constructor(
    private readonly store: RuntimeResilienceStore,
    private readonly evidence:
      RuntimeEvidenceChainService,
    private readonly status:
      RuntimeResilienceStatusService,
  ) {}

  verify(): RuntimeVerificationResult {
    const snapshot = this.status.snapshot();
    const integrity = this.evidence.verify();

    const configurations =
      this.store.listConfigurations();

    const policies = this.store.listPolicies();
    const signals = this.store.listSignals();
    const baselines = this.store.listBaselines();

    const checks: RuntimeVerificationCheck[] = [
      this.check(
        "evidence_chain_integrity",
        true,
        integrity.valid,
      ),
      this.check(
        "control_mode_available",
        true,
        Boolean(snapshot.controlMode),
      ),
      this.check(
        "configuration_exists",
        true,
        configurations.length > 0,
      ),
      this.check(
        "active_configuration_exists",
        true,
        configurations.some(
          (configuration) =>
            configuration.status ===
            ResilienceConfigurationStatus.ACTIVE,
        ),
      ),
      this.check(
        "policy_exists",
        true,
        policies.length > 0,
      ),
      this.check(
        "active_policy_exists",
        true,
        policies.some(
          (policy) =>
            policy.status ===
            ResiliencePolicyStatus.ACTIVE,
        ),
      ),
      this.check(
        "risk_evaluation_exists",
        true,
        snapshot.riskEvaluations > 0,
      ),
      this.check(
        "healthy_signal_exists",
        true,
        signals.some(
          (signal) =>
            signal.status ===
            RuntimeSignalStatus.HEALTHY,
        ),
      ),
      this.check(
        "active_baseline_exists",
        true,
        baselines.some(
          (baseline) => baseline.active,
        ),
      ),
      this.check(
        "evidence_entries_exist",
        true,
        snapshot.evidenceEntries > 0,
      ),
      this.check(
        "no_failed_actions",
        0,
        snapshot.failedActions,
      ),
      this.check(
        "no_unhealthy_signals",
        0,
        snapshot.unhealthySignals,
      ),
      this.check(
        "health_not_unhealthy",
        true,
        snapshot.healthStatus !== "unhealthy",
      ),
    ];

    const checksFailed =
      checks.filter((check) => !check.success).length;

    return {
      success:
        checksFailed === 0 &&
        integrity.valid &&
        snapshot.healthStatus !== "unhealthy",
      system:
        "AVOS Production Hardening V8 — Mega Pack 3",
      version: "v8-mega-pack-3",
      healthStatus: snapshot.healthStatus,
      evidenceChainVerified: integrity.valid,
      checksPassed: checks.length - checksFailed,
      checksFailed,
      checks,
      snapshot,
      verifiedAt: new Date().toISOString(),
    };
  }

  private check(
    name: string,
    expected: unknown,
    actual: unknown,
  ): RuntimeVerificationCheck {
    return {
      name,
      success: expected === actual,
      expected,
      actual,
    };
  }
}
