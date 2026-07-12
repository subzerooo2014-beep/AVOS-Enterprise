import {
  V5RecoveryPlan,
  V5SupremeRuntimeInput,
} from "./contracts";

export class V5SupremeResilienceGenerator {
  recovery(input: V5SupremeRuntimeInput): V5RecoveryPlan {
    if (input.recoveryTier === "mission-critical") {
      return {
        rpoMinutes: 5,
        rtoMinutes: 15,
        backupFrequencyMinutes: 15,
        restoreTestsPerMonth: 4,
      };
    }

    if (input.recoveryTier === "critical") {
      return {
        rpoMinutes: 30,
        rtoMinutes: 60,
        backupFrequencyMinutes: 60,
        restoreTestsPerMonth: 2,
      };
    }

    return {
      rpoMinutes: 240,
      rtoMinutes: 480,
      backupFrequencyMinutes: 240,
      restoreTestsPerMonth: 1,
    };
  }

  continuity(input: V5SupremeRuntimeInput) {
    return {
      alternateRegions: input.regions
        .filter((region) => !region.primary)
        .map((region) => region.key),
      crisisModes: [
        "regional-failover",
        "read-only-degraded-mode",
        "manual-operations-mode",
      ],
      annualExerciseRequired: true,
      evidenceRetentionYears: 7,
    };
  }
}
