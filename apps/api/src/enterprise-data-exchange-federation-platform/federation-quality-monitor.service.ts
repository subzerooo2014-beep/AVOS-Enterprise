import { Injectable } from "@nestjs/common";
import type { FederationQualityResultRecord } from "./enterprise-data-exchange-federation.types";

@Injectable()
export class FederationQualityMonitorService {
  private readonly results: FederationQualityResultRecord[] = [];

  check(
    messageId: string,
    payload: Record<string, unknown>,
    requiredFields: string[] = [],
  ): FederationQualityResultRecord {
    const findings: string[] = [];

    for (const field of requiredFields) {
      if (
        payload[field] === undefined ||
        payload[field] === null ||
        payload[field] === ""
      ) {
        findings.push(`Required field '${field}' is missing.`);
      }
    }

    const score =
      requiredFields.length === 0
        ? 100
        : Math.max(
            0,
            100 - (findings.length / requiredFields.length) * 100,
          );

    const result: FederationQualityResultRecord = {
      id: `federation-quality-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`,
      messageId,
      passed: findings.length === 0,
      score: Math.round(score * 100) / 100,
      findings,
      checkedAt: new Date().toISOString(),
    };

    this.results.unshift(result);
    return this.clone(result);
  }

  list(): FederationQualityResultRecord[] {
    return this.results.map((result) => this.clone(result));
  }

  count(): number {
    return this.results.length;
  }

  failureCount(): number {
    return this.results.filter((result) => !result.passed).length;
  }

  private clone(
    result: FederationQualityResultRecord,
  ): FederationQualityResultRecord {
    return {
      ...result,
      findings: [...result.findings],
    };
  }
}
