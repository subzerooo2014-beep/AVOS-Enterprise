import { UltraJFinding, UltraJSeverity, UltraJValue } from "./contracts";

export interface EnterpriseIntelligenceGoal {
  key: string;
  objective: string;
  priority: number;
  context: Record<string, UltraJValue>;
  constraints: string[];
}

export interface EnterpriseIntelligenceInsight {
  key: string;
  goalKey: string;
  confidence: number;
  recommendation: string;
  requiredControls: string[];
}

export interface AutonomousEnterpriseIntelligenceResult {
  insights: EnterpriseIntelligenceInsight[];
  intelligenceScore: number;
  findings: UltraJFinding[];
  generatedAt: string;
}

export class AutonomousEnterpriseIntelligence {
  reason(
    goals: readonly EnterpriseIntelligenceGoal[],
  ): AutonomousEnterpriseIntelligenceResult {
    const findings: UltraJFinding[] = [];

    const insights = [...goals]
      .sort((a, b) => b.priority - a.priority)
      .map((goal): EnterpriseIntelligenceInsight => {
        const contextDepth = Object.keys(goal.context).length;
        const confidence = Math.max(
          0,
          Math.min(
            100,
            Math.round(goal.priority * 0.75 + contextDepth * 4 - goal.constraints.length),
          ),
        );

        if (confidence < 60) {
          findings.push({
            code: "ENTERPRISE_INTELLIGENCE_LOW_CONFIDENCE",
            severity: UltraJSeverity.WARNING,
            message: `Goal ${goal.key} produced a low-confidence insight.`,
            subject: goal.key,
            metadata: { confidence },
          });
        }

        return {
          key: `insight-${goal.key}`,
          goalKey: goal.key,
          confidence,
          recommendation: `execute-${goal.key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
          requiredControls:
            goal.constraints.length > 0
              ? ["constraint-validation", "continuous-observability"]
              : ["continuous-observability"],
        };
      });

    const intelligenceScore =
      insights.length === 0
        ? 100
        : Math.round(
            insights.reduce((sum, insight) => sum + insight.confidence, 0) /
              insights.length,
          );

    return {
      insights,
      intelligenceScore,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}

