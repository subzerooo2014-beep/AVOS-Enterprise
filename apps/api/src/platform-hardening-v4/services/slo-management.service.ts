import { Injectable } from "@nestjs/common";
import { SloStatus } from "../enums/slo-status.enum";
import { SloObjective } from "../interfaces/slo-objective.interface";
import { RequestMetricsService } from "../../platform-hardening-v3/services/request-metrics.service";

@Injectable()
export class SloManagementService {
  constructor(
    private readonly metrics:
      RequestMetricsService,
  ) {}

  evaluate(): SloObjective[] {
    const snapshot =
      this.metrics.getSnapshot();

    const total =
      snapshot.totals.requests;

    const availabilityPercent =
      total > 0
        ? Number(
            (
              (snapshot.totals.successfulRequests /
                total) *
              100
            ).toFixed(3),
          )
        : 100;

    return [
      this.buildObjective({
        id: "availability",
        name: "Platform Availability",
        description:
          "Successful request availability objective",
        metric: "availabilityPercent",
        comparison: "gte",
        target: 99.9,
        currentValue:
          availabilityPercent,
      }),
      this.buildObjective({
        id: "error-rate",
        name: "Request Error Rate",
        description:
          "Maximum acceptable request error rate",
        metric: "errorRatePercent",
        comparison: "lte",
        target: 1,
        currentValue:
          snapshot.rates.errorRatePercent,
      }),
      this.buildObjective({
        id: "average-latency",
        name: "Average Request Latency",
        description:
          "Maximum acceptable average latency",
        metric: "averageLatencyMs",
        comparison: "lte",
        target: 500,
        currentValue:
          snapshot.latency.averageMs,
      }),
      this.buildObjective({
        id: "slow-request-rate",
        name: "Slow Request Rate",
        description:
          "Maximum acceptable slow request ratio",
        metric: "slowRequestRatePercent",
        comparison: "lte",
        target: 5,
        currentValue:
          snapshot.rates.slowRequestRatePercent,
      }),
    ];
  }

  getSummary() {
    const objectives = this.evaluate();

    return {
      total: objectives.length,
      healthy: objectives.filter(
        (item) =>
          item.status === SloStatus.HEALTHY,
      ).length,
      atRisk: objectives.filter(
        (item) =>
          item.status === SloStatus.AT_RISK,
      ).length,
      breached: objectives.filter(
        (item) =>
          item.status === SloStatus.BREACHED,
      ).length,
      minimumErrorBudgetRemainingPercent:
        objectives.length > 0
          ? Math.min(
              ...objectives.map(
                (item) =>
                  item.errorBudgetRemainingPercent,
              ),
            )
          : 100,
      objectives,
    };
  }

  private buildObjective(
    input: Omit<
      SloObjective,
      | "status"
      | "errorBudgetRemainingPercent"
      | "evaluatedAt"
    >,
  ): SloObjective {
    const passed =
      input.comparison === "gte"
        ? input.currentValue >= input.target
        : input.currentValue <= input.target;

    const violationPercent =
      this.calculateViolationPercent(
        input.currentValue,
        input.target,
        input.comparison,
      );

    let status: SloStatus;

    if (passed) {
      status = SloStatus.HEALTHY;
    } else if (violationPercent <= 20) {
      status = SloStatus.AT_RISK;
    } else {
      status = SloStatus.BREACHED;
    }

    const errorBudgetRemainingPercent =
      this.calculateErrorBudgetRemainingPercent(
        input.currentValue,
        input.target,
        input.comparison,
      );

    return {
      ...input,
      currentValue: Number(
        input.currentValue.toFixed(3),
      ),
      status,
      errorBudgetRemainingPercent:
        Number(
          errorBudgetRemainingPercent.toFixed(2),
        ),
      evaluatedAt:
        new Date().toISOString(),
    };
  }

  private calculateViolationPercent(
    current: number,
    target: number,
    comparison: "gte" | "lte",
  ): number {
    if (target === 0) {
      if (comparison === "lte") {
        return current <= 0 ? 0 : 100;
      }

      return current >= 0 ? 0 : 100;
    }

    if (comparison === "gte") {
      if (current >= target) {
        return 0;
      }

      return Math.max(
        0,
        ((target - current) / target) * 100,
      );
    }

    if (current <= target) {
      return 0;
    }

    return Math.max(
      0,
      ((current - target) / target) * 100,
    );
  }

  private calculateErrorBudgetRemainingPercent(
    current: number,
    target: number,
    comparison: "gte" | "lte",
  ): number {
    if (comparison === "lte") {
      if (target <= 0) {
        return current <= 0 ? 100 : 0;
      }

      const consumedPercent =
        (current / target) * 100;

      return this.clamp(
        100 - consumedPercent,
        0,
        100,
      );
    }

    if (target >= 100) {
      return current >= target ? 100 : 0;
    }

    const allowedFailure =
      100 - target;

    const actualFailure =
      100 - current;

    if (allowedFailure <= 0) {
      return actualFailure <= 0 ? 100 : 0;
    }

    const consumedPercent =
      (actualFailure / allowedFailure) * 100;

    return this.clamp(
      100 - consumedPercent,
      0,
      100,
    );
  }

  private clamp(
    value: number,
    minimum: number,
    maximum: number,
  ): number {
    return Math.min(
      maximum,
      Math.max(minimum, value),
    );
  }
}
