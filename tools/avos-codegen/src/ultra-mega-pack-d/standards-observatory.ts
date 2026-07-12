import { UltraDFinding, UltraDSeverity } from "./contracts";

export interface GlobalStandardRequirement {
  key: string;
  standard: string;
  domain: string;
  mandatory: boolean;
  controls: string[];
}

export interface ImplementedControl {
  key: string;
  domains: string[];
  evidenceAvailable: boolean;
  maturity: number;
}

export interface StandardsGap {
  requirementKey: string;
  standard: string;
  missingControls: string[];
  severity: UltraDSeverity;
}

export interface StandardsObservatoryReport {
  coverage: number;
  gaps: StandardsGap[];
  findings: UltraDFinding[];
  observedAt: string;
}

export class GlobalStandardsObservatory {
  analyze(
    requirements: readonly GlobalStandardRequirement[],
    implementedControls: readonly ImplementedControl[],
  ): StandardsObservatoryReport {
    const controls = new Map(
      implementedControls.map((control) => [control.key, control]),
    );
    const gaps: StandardsGap[] = [];
    const findings: UltraDFinding[] = [];
    let satisfied = 0;
    let total = 0;

    for (const requirement of requirements) {
      const missingControls = requirement.controls.filter((key) => {
        const control = controls.get(key);
        return !control || !control.evidenceAvailable || control.maturity < 50;
      });

      total += requirement.controls.length;
      satisfied += requirement.controls.length - missingControls.length;

      if (missingControls.length > 0) {
        const severity = requirement.mandatory
          ? UltraDSeverity.ERROR
          : UltraDSeverity.WARNING;

        gaps.push({
          requirementKey: requirement.key,
          standard: requirement.standard,
          missingControls,
          severity,
        });

        findings.push({
          code: "GLOBAL_STANDARD_GAP",
          severity,
          message: `Requirement ${requirement.key} has control gaps.`,
          subject: requirement.key,
          metadata: {
            standard: requirement.standard,
            missingControls,
          },
        });
      }
    }

    return {
      coverage: total === 0 ? 100 : Math.round((satisfied / total) * 100),
      gaps,
      findings,
      observedAt: new Date().toISOString(),
    };
  }
}
