import { Injectable } from "@nestjs/common";
import { TrafficDecision } from "../enums/traffic-decision.enum";
import { TrafficPolicy } from "../interfaces/traffic-policy.interface";
import { ResilienceStateService } from "./resilience-state.service";

@Injectable()
export class TrafficProtectionService {
  private activeRequests = 0;
  private totalAllowed = 0;
  private totalRejected = 0;
  private lastDecision = TrafficDecision.ALLOW;

  private readonly requestTimestamps: number[] = [];
  private readonly rejectionReasons =
    new Map<string, number>();

  private policy: TrafficPolicy = {
    enabled: true,
    requestsPerMinute:
      this.readPositiveInteger(
        process.env.AVOS_REQUESTS_PER_MINUTE,
        1200,
      ),
    maximumConcurrentRequests:
      this.readPositiveInteger(
        process.env.AVOS_MAX_CONCURRENT_REQUESTS,
        100,
      ),
    loadSheddingThresholdPercent:
      this.readPercentage(
        process.env.AVOS_LOAD_SHEDDING_THRESHOLD_PERCENT,
        90,
      ),
    excludedPaths: [
      "/platform-hardening/v3/status",
      "/platform-hardening/v4/status",
    ],
    maintenanceAllowedPaths: [
      "/platform-hardening/v3/status",
      "/platform-hardening/v4/status",
      "/platform-hardening/v4/snapshot",
      "/platform-hardening/v4/mode",
      "/platform-hardening/v4/maintenance/disable",
    ],
  };

  constructor(
    private readonly resilience:
      ResilienceStateService,
  ) {}

  evaluate(path: string): TrafficDecision {
    this.pruneWindow();

    if (!this.policy.enabled) {
      return this.allow();
    }

    if (
      this.matchesPath(
        path,
        this.policy.excludedPaths,
      )
    ) {
      return this.allow();
    }

    if (this.resilience.isEmergency()) {
      return this.reject(
        TrafficDecision.EMERGENCY_BLOCK,
      );
    }

    if (
      this.resilience.isMaintenance() &&
      !this.matchesPath(
        path,
        this.policy.maintenanceAllowedPaths,
      )
    ) {
      return this.reject(
        TrafficDecision.MAINTENANCE,
      );
    }

    if (
      this.requestTimestamps.length >=
      this.policy.requestsPerMinute
    ) {
      return this.reject(
        TrafficDecision.RATE_LIMIT,
      );
    }

    if (
      this.activeRequests >=
      this.policy.maximumConcurrentRequests
    ) {
      return this.reject(
        TrafficDecision.CONCURRENCY_LIMIT,
      );
    }

    const concurrencyPercent =
      this.getConcurrencyUsagePercent();

    if (
      concurrencyPercent >=
        this.policy.loadSheddingThresholdPercent &&
      this.shouldShedPath(path)
    ) {
      return this.reject(
        TrafficDecision.LOAD_SHED,
      );
    }

    return this.allow();
  }

  beginRequest(): void {
    this.activeRequests += 1;
    this.requestTimestamps.push(Date.now());
  }

  finishRequest(): void {
    this.activeRequests = Math.max(
      0,
      this.activeRequests - 1,
    );
  }

  getPolicy(): TrafficPolicy {
    return {
      ...this.policy,
      excludedPaths: [
        ...this.policy.excludedPaths,
      ],
      maintenanceAllowedPaths: [
        ...this.policy.maintenanceAllowedPaths,
      ],
    };
  }

  updatePolicy(
    patch: Partial<TrafficPolicy>,
  ): TrafficPolicy {
    this.policy = {
      ...this.policy,
      ...patch,
      excludedPaths:
        patch.excludedPaths ??
        this.policy.excludedPaths,
      maintenanceAllowedPaths:
        patch.maintenanceAllowedPaths ??
        this.policy.maintenanceAllowedPaths,
    };

    return this.getPolicy();
  }

  getState() {
    this.pruneWindow();

    return {
      activeRequests: this.activeRequests,
      maximumConcurrentRequests:
        this.policy.maximumConcurrentRequests,
      recentRequestCount:
        this.requestTimestamps.length,
      requestsPerMinuteLimit:
        this.policy.requestsPerMinute,
      concurrencyUsagePercent:
        this.getConcurrencyUsagePercent(),
      loadSheddingActive:
        this.getConcurrencyUsagePercent() >=
        this.policy.loadSheddingThresholdPercent,
      lastDecision: this.lastDecision,
      totalAllowed: this.totalAllowed,
      totalRejected: this.totalRejected,
      rejectionReasons:
        Object.fromEntries(
          this.rejectionReasons,
        ),
    };
  }

  private allow(): TrafficDecision {
    this.totalAllowed += 1;
    this.lastDecision =
      TrafficDecision.ALLOW;

    return TrafficDecision.ALLOW;
  }

  private reject(
    decision: TrafficDecision,
  ): TrafficDecision {
    this.totalRejected += 1;
    this.lastDecision = decision;

    this.rejectionReasons.set(
      decision,
      (this.rejectionReasons.get(decision) ?? 0) + 1,
    );

    return decision;
  }

  private shouldShedPath(path: string): boolean {
    return (
      path.includes("/reports") ||
      path.includes("/analytics") ||
      path.includes("/export") ||
      path.includes("/ai-") ||
      path.includes("/publisher")
    );
  }

  private getConcurrencyUsagePercent(): number {
    if (
      this.policy.maximumConcurrentRequests <= 0
    ) {
      return 0;
    }

    return Number(
      (
        (this.activeRequests /
          this.policy.maximumConcurrentRequests) *
        100
      ).toFixed(2),
    );
  }

  private pruneWindow(): void {
    const minimumTimestamp =
      Date.now() - 60_000;

    while (
      this.requestTimestamps.length > 0 &&
      this.requestTimestamps[0] <
        minimumTimestamp
    ) {
      this.requestTimestamps.shift();
    }
  }

  private matchesPath(
    path: string,
    values: string[],
  ): boolean {
    return values.some(
      (value) =>
        path === value ||
        path.startsWith(`${value}?`),
    );
  }

  private readPositiveInteger(
    value: string | undefined,
    fallback: number,
  ): number {
    const parsed = Number(value);

    if (
      Number.isInteger(parsed) &&
      parsed > 0
    ) {
      return parsed;
    }

    return fallback;
  }

  private readPercentage(
    value: string | undefined,
    fallback: number,
  ): number {
    const parsed = Number(value);

    if (
      Number.isFinite(parsed) &&
      parsed >= 1 &&
      parsed <= 100
    ) {
      return parsed;
    }

    return fallback;
  }
}
