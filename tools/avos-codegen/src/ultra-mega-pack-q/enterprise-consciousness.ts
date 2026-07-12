import { UltraQFinding, UltraQSeverity, UltraQValue } from "./contracts";

export interface ConsciousnessSignal {
  key: string;
  domain: "operations" | "finance" | "customers" | "ai" | "governance";
  awareness: number;
  confidence: number;
  urgency: number;
  context: Record<string, UltraQValue>;
}

export interface EnterpriseConsciousnessInsight {
  key: string;
  domain: string;
  score: number;
  priority: number;
  recommendation: string;
}

export interface UniversalEnterpriseConsciousnessResult {
  consciousnessScore: number;
  insights: EnterpriseConsciousnessInsight[];
  findings: UltraQFinding[];
  generatedAt: string;
}

export class UniversalEnterpriseConsciousness {
  perceive(
    signals: readonly ConsciousnessSignal[],
  ): UniversalEnterpriseConsciousnessResult {
    const findings: UltraQFinding[] = [];

    const insights = signals
      .map((signal): EnterpriseConsciousnessInsight => {
        const contextDepth = Object.keys(signal.context).length;
        const score = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              signal.awareness * 0.45 +
                signal.confidence * 0.35 +
                Math.min(100, contextDepth * 10) * 0.1 +
                Math.max(0, 100 - signal.urgency) * 0.1,
            ),
          ),
        );

        if (score < 60) {
          findings.push({
            code: "ENTERPRISE_CONSCIOUSNESS_LOW_SIGNAL",
            severity: UltraQSeverity.WARNING,
            message: `Signal ${signal.key} produced weak contextual awareness.`,
            subject: signal.key,
            metadata: { score },
          });
        }

        return {
          key: `insight-${signal.key}`,
          domain: signal.domain,
          score,
          priority: Math.max(1, Math.min(100, Math.round(signal.urgency * 0.6 + score * 0.4))),
          recommendation: `coordinate-${signal.domain}-${signal.key}`,
        };
      })
      .sort((a, b) => b.priority - a.priority);

    return {
      consciousnessScore:
        insights.length === 0
          ? 100
          : Math.round(
              insights.reduce((sum, insight) => sum + insight.score, 0) /
                insights.length,
            ),
      insights,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
