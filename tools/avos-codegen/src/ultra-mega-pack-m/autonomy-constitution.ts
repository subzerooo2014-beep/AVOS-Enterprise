import { UltraMFinding, UltraMSeverity } from "./contracts";

export interface AutonomyClause {
  key: string;
  domain: "ai" | "operations" | "finance" | "security" | "governance";
  maximumAutonomy: number;
  minimumOversight: number;
  mandatory: boolean;
  requiredControls: string[];
}

export interface AutonomyRequest {
  domain: AutonomyClause["domain"];
  requestedAutonomy: number;
  oversightLevel: number;
  controls: string[];
}

export interface EnterpriseAutonomyConstitutionResult {
  approved: boolean;
  autonomyScore: number;
  matchedClauses: string[];
  missingControls: string[];
  findings: UltraMFinding[];
  evaluatedAt: string;
}

export class EnterpriseAutonomyConstitution {
  evaluate(
    request: AutonomyRequest,
    clauses: readonly AutonomyClause[],
  ): EnterpriseAutonomyConstitutionResult {
    const applicable = clauses.filter((clause) => clause.domain === request.domain);

    const missingControls = Array.from(
      new Set(
        applicable.flatMap((clause) =>
          clause.requiredControls.filter(
            (control) => !request.controls.includes(control),
          ),
        ),
      ),
    );

    const autonomyViolation = applicable.some(
      (clause) =>
        request.requestedAutonomy > clause.maximumAutonomy ||
        request.oversightLevel < clause.minimumOversight,
    );

    const findings: UltraMFinding[] = [];

    if (missingControls.length > 0) {
      findings.push({
        code: "AUTONOMY_CONSTITUTION_CONTROL_MISSING",
        severity: UltraMSeverity.ERROR,
        message: "Required autonomy controls are missing.",
        metadata: { missingControls },
      });
    }

    if (autonomyViolation) {
      findings.push({
        code: "AUTONOMY_CONSTITUTION_BOUNDARY_VIOLATION",
        severity: UltraMSeverity.CRITICAL,
        message: "Requested autonomy exceeds constitutional boundaries.",
        metadata: {
          requestedAutonomy: request.requestedAutonomy,
          oversightLevel: request.oversightLevel,
        },
      });
    }

    const autonomyScore = Math.max(
      0,
      Math.min(
        100,
        100 - missingControls.length * 12 - (autonomyViolation ? 45 : 0),
      ),
    );

    return {
      approved:
        !autonomyViolation &&
        missingControls.length === 0 &&
        autonomyScore >= 70,
      autonomyScore,
      matchedClauses: applicable.map((clause) => clause.key),
      missingControls,
      findings,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
