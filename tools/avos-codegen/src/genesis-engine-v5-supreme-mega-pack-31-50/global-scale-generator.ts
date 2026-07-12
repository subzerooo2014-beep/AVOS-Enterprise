import {
  V5RegionTopology,
  V5SupremeRuntimeInput,
} from "./contracts";

export class V5GlobalScaleGenerator {
  topology(input: V5SupremeRuntimeInput): V5RegionTopology[] {
    return input.regions.map((region) => ({
      regionKey: region.key,
      role: region.primary ? "primary" : "secondary",
      routingWeight: region.primary ? 60 : 40 / Math.max(1, input.regions.length - 1),
      replicationMode:
        region.primary && input.recoveryTier === "mission-critical"
          ? "synchronous"
          : "asynchronous",
      residencyEnforced: region.dataResidencyRequired,
    }));
  }

  routing(input: V5SupremeRuntimeInput) {
    return {
      strategy: "latency-and-residency-aware",
      healthBasedFailover: true,
      geoAffinityEnabled: true,
      rules: input.regions.map((region) => ({
        regionKey: region.key,
        maxLatencyMs: region.latencyTargetMs,
        residencyRequired: region.dataResidencyRequired,
      })),
    };
  }
}
