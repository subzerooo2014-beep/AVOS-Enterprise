import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  EnterpriseRiskLevel,
  EnterpriseSignal,
} from "./enterprise-e8.types";

@Injectable()
export class EnterpriseSignalDetectionService {
  private readonly signals: EnterpriseSignal[] = [];

  detect(input: {
    domain?: string;
    metric?: string;
    value?: number;
    threshold?: number;
  }): EnterpriseSignal {
    const value = input.value ?? 72;
    const threshold = input.threshold ?? 70;
    const ratio = threshold <= 0 ? 1 : value / threshold;
    const severity: EnterpriseRiskLevel =
      ratio >= 1.5
        ? "CRITICAL"
        : ratio >= 1.2
          ? "HIGH"
          : ratio >= 1
            ? "MEDIUM"
            : "LOW";

    const signal: EnterpriseSignal = {
      id: randomUUID(),
      domain: input.domain?.trim() || "enterprise-runtime",
      metric: input.metric?.trim() || "operational-pressure",
      value,
      threshold,
      severity,
      detectedAt: new Date().toISOString(),
    };

    this.signals.push(signal);
    return signal;
  }

  list(): EnterpriseSignal[] {
    return [...this.signals];
  }

  latest(): EnterpriseSignal | null {
    return this.signals.length > 0
      ? this.signals[this.signals.length - 1]
      : null;
  }

  count(): number {
    return this.signals.length;
  }
}