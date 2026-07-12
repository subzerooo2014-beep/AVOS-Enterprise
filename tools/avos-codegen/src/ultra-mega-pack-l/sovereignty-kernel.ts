import { randomUUID } from "node:crypto";
import { UltraLEvidence, UltraLFinding, UltraLSeverity } from "./contracts";

export interface SovereigntyRule {
  key: string;
  domain: "data" | "security" | "operations" | "ai" | "finance";
  mandatory: boolean;
  authority: number;
  allowedRegions: string[];
  requiredControls: string[];
}

export interface SovereigntyRequest {
  systemKey: string;
  action: string;
  domain: SovereigntyRule["domain"];
  region: string;
  controls: string[];
}

export interface SovereigntyDecision {
  allowed: boolean;
  score: number;
  matchedRules: string[];
  missingControls: string[];
  findings: UltraLFinding[];
  evidence: UltraLEvidence[];
  decidedAt: string;
}

export class EnterpriseSovereigntyKernel {
  evaluate(
    request: SovereigntyRequest,
    rules: readonly SovereigntyRule[],
  ): SovereigntyDecision {
    const applicable = rules
      .filter((rule) => rule.domain === request.domain)
      .sort((a, b) => b.authority - a.authority);

    const missingControls = Array.from(
      new Set(
        applicable.flatMap((rule) =>
          rule.requiredControls.filter(
            (control) => !request.controls.includes(control),
          ),
        ),
      ),
    );

    const regionViolations = applicable.filter(
      (rule) =>
        rule.allowedRegions.length > 0 &&
        !rule.allowedRegions.includes(request.region),
    );

    const mandatoryViolation =
      missingControls.length > 0 ||
      regionViolations.some((rule) => rule.mandatory);

    const score = Math.max(
      0,
      Math.min(
        100,
        100 - missingControls.length * 12 - regionViolations.length * 25,
      ),
    );

    const findings: UltraLFinding[] = [];

    if (missingControls.length > 0) {
      findings.push({
        code: "SOVEREIGNTY_CONTROL_MISSING",
        severity: UltraLSeverity.ERROR,
        message: "Required sovereignty controls are missing.",
        subject: request.action,
        metadata: { missingControls },
      });
    }

    if (regionViolations.length > 0) {
      findings.push({
        code: "SOVEREIGNTY_REGION_VIOLATION",
        severity: UltraLSeverity.CRITICAL,
        message: "Requested region violates sovereignty policy.",
        subject: request.region,
        metadata: {
          rules: regionViolations.map((rule) => rule.key),
        },
      });
    }

    return {
      allowed: !mandatoryViolation && score >= 70,
      score,
      matchedRules: applicable.map((rule) => rule.key),
      missingControls,
      findings,
      evidence: [
        {
          id: randomUUID(),
          systemKey: request.systemKey,
          category: "enterprise-sovereignty-kernel",
          action: "sovereignty.evaluated",
          message: `Sovereignty decision completed for ${request.action}.`,
          metadata: {
            allowed: !mandatoryViolation && score >= 70,
            score,
            region: request.region,
          },
          createdAt: new Date().toISOString(),
        },
      ],
      decidedAt: new Date().toISOString(),
    };
  }
}
