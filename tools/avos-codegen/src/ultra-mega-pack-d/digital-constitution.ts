import { UltraDFinding, UltraDSeverity, UltraDValue } from "./contracts";

export enum ConstitutionRuleEffect {
  ALLOW = "allow",
  DENY = "deny",
  REQUIRE_CONTROL = "require_control",
}

export interface ConstitutionRule {
  key: string;
  principle: string;
  effect: ConstitutionRuleEffect;
  priority: number;
  requiredFacts: string[];
  controls: string[];
}

export interface ConstitutionEvaluationInput {
  systemKey: string;
  action: string;
  facts: Record<string, UltraDValue>;
}

export interface ConstitutionEvaluationResult {
  compliant: boolean;
  score: number;
  matchedRules: string[];
  controls: string[];
  findings: UltraDFinding[];
  evaluatedAt: string;
}

export class AvosDigitalConstitution {
  private readonly rules = new Map<string, ConstitutionRule>();

  register(rule: ConstitutionRule): void {
    if (!rule.key.trim()) throw new Error("Constitution rule key is required.");
    this.rules.set(rule.key, structuredClone(rule));
  }

  evaluate(input: ConstitutionEvaluationInput): ConstitutionEvaluationResult {
    const rules = Array.from(this.rules.values()).sort(
      (left, right) => right.priority - left.priority,
    );
    const matchedRules: string[] = [];
    const controls = new Set<string>();
    const findings: UltraDFinding[] = [];
    let score = 100;
    let denied = false;

    for (const rule of rules) {
      const missingFacts = rule.requiredFacts.filter(
        (fact) => !(fact in input.facts),
      );

      if (missingFacts.length > 0) {
        score -= Math.min(20, missingFacts.length * 5);
        findings.push({
          code: "CONSTITUTION_FACTS_MISSING",
          severity: UltraDSeverity.WARNING,
          message: `Rule ${rule.key} could not be fully evaluated.`,
          subject: rule.key,
          metadata: { missingFacts },
        });
        continue;
      }

      matchedRules.push(rule.key);

      if (rule.effect === ConstitutionRuleEffect.DENY) {
        denied = true;
        score -= 60;
        findings.push({
          code: "CONSTITUTION_DENIAL",
          severity: UltraDSeverity.CRITICAL,
          message: `Action ${input.action} violates ${rule.principle}.`,
          subject: rule.key,
          metadata: {},
        });
      }

      if (rule.effect === ConstitutionRuleEffect.REQUIRE_CONTROL) {
        rule.controls.forEach((control) => controls.add(control));
        score -= Math.min(15, rule.controls.length * 2);
      }
    }

    return {
      compliant: !denied && score >= 65,
      score: Math.max(0, Math.min(100, score)),
      matchedRules,
      controls: Array.from(controls),
      findings,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
