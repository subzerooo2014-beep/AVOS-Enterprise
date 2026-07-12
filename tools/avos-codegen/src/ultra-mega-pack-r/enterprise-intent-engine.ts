import { UltraRFinding, UltraRSeverity, UltraRValue } from "./contracts";

export interface EnterpriseIntent {
  key: string;
  objective: string;
  priority: number;
  confidence: number;
  constraints: string[];
  context: Record<string, UltraRValue>;
}

export interface NormalizedEnterpriseIntent {
  key: string;
  normalizedObjective: string;
  score: number;
  controls: string[];
}

export interface UniversalEnterpriseIntentResult {
  intents: NormalizedEnterpriseIntent[];
  intentScore: number;
  findings: UltraRFinding[];
  normalizedAt: string;
}

export class UniversalEnterpriseIntentEngine {
  normalize(
    intents: readonly EnterpriseIntent[],
  ): UniversalEnterpriseIntentResult {
    const findings: UltraRFinding[] = [];

    const normalized = intents
      .map((intent): NormalizedEnterpriseIntent => {
        const contextDepth = Object.keys(intent.context).length;
        const score = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              intent.priority * 0.45 +
                intent.confidence * 0.4 +
                Math.min(100, contextDepth * 10) * 0.1 -
                intent.constraints.length * 1.5,
            ),
          ),
        );

        if (score < 65) {
          findings.push({
            code: "ENTERPRISE_INTENT_SCORE_LOW",
            severity: UltraRSeverity.WARNING,
            message: `Intent ${intent.key} is below the preferred score.`,
            subject: intent.key,
            metadata: { score },
          });
        }

        return {
          key: intent.key,
          normalizedObjective: intent.objective.trim().toLowerCase(),
          score,
          controls:
            intent.constraints.length > 0
              ? ["constraint-validation", "continuous-observability"]
              : ["continuous-observability"],
        };
      })
      .sort((a, b) => b.score - a.score);

    return {
      intents: normalized,
      intentScore:
        normalized.length === 0
          ? 100
          : Math.round(
              normalized.reduce((sum, intent) => sum + intent.score, 0) /
                normalized.length,
            ),
      findings,
      normalizedAt: new Date().toISOString(),
    };
  }
}
